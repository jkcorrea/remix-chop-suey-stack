# Enable a future flag that will be on by default in 2.0:
# https://www.edgedb.com/docs/datamodel/access_policies#nonrecursive
using future nonrecursive_access_policies;

module default {
  # NOTE: couldn't find a good architecture to globally set the
  # current user during server requests. So this isn't used for now.
  # Allows us to set access policies for the current user
  # https://www.edgedb.com/docs/datamodel/globals
  global current_user_id -> uuid;
  global current_user := (
    select User filter .id = global current_user_id
  );

  abstract type Timestamped {
    required property createdAt -> datetime {
      default := std::datetime_current();
      readonly := true;
    };
    # TODO updated_at timestamsps aren't a thing yet, but lets add them when they are:
    # https://github.com/edgedb/edgedb/discussions/3180
    required property updatedAt -> datetime {
      default := std::datetime_current();
    };
    # NOTE: I don't recommend using soft deletes, so leaving this out
    # property deletedAt -> datetime;
  }

#REGION - Accounts
  type User extending Timestamped {
    property email -> str {
      constraint exclusive;
    };

    property name -> str;
    property avatar -> str;
    property passwordHash -> str;
    property emailVerified -> bool {
      default := false;
    };

    # Relations
    link subscription -> UserSubscription;
    multi link accounts := .<user[is Account];
    multi link things := .<user[is Thing];

    # access policy self_has_full_access
    #   allow all
    #   using (global current_user_id ?= .id);
  }

  scalar type SocialProvider extending enum<DISCORD, FACEBOOK, GITHUB, GOOGLE, MICROSOFT, TWITTER>;
  type Account extending Timestamped {
    required property provider -> SocialProvider;
    required property providerAccountId -> str;
    property refreshToken -> str;
    property accessToken -> str;
    property expiresAt -> int32;
    property tokenType -> str;
    property scope -> str;
    property idToken -> str;
    property sessionState -> str;

    required link user -> User;

    constraint exclusive on ((.provider, .providerAccountId));
  }

  type VerificationToken {
    required property identifier -> str;
    required property token -> str;
    required property expiresAt -> datetime;

    constraint exclusive on ((.identifier, .token));
  }
#ENDREGION

  type Thing extending Timestamped {
    required property name -> str;
    property description -> str;
    required property public -> bool {
      default := false;
    };

    required link user -> User;

    # access policy self_has_full_access
    #   allow all
    #   using (global current_user_id ?= .user.id);
    # access policy public_has_read_access
    #   allow select
    #   using (.public);
  }

  scalar type StripeStatus extending enum<incomplete, incomplete_expired, trialing, active, past_due, canceled, unpaid>;
  type UserSubscription extending Timestamped {
    property stripeCustomerId -> str {
      constraint exclusive;
    };
    property stripeSubscriptionId -> str;
    property stripePlanId -> str;
    property status -> StripeStatus;
    property currentPeriodStart -> int32;
    property currentPeriodEnd -> int32;
    property cancelAtPeriodEnd -> bool;

    required link user -> User;
  }
}
