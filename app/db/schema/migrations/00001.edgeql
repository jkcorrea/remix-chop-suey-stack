CREATE MIGRATION m1wtr7sqlye4qoxyo4fwwpkwair47opemrxgycglny3t4ackwsvqma
    ONTO initial
{
  CREATE FUTURE nonrecursive_access_policies;
  CREATE GLOBAL default::current_user_id -> std::uuid;
  CREATE ABSTRACT TYPE default::Timestamped {
      CREATE REQUIRED PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
          SET readonly := true;
      };
      CREATE REQUIRED PROPERTY updatedAt -> std::datetime {
          SET default := (std::datetime_current());
      };
  };
  CREATE TYPE default::User EXTENDING default::Timestamped {
      CREATE PROPERTY avatar -> std::str;
      CREATE PROPERTY email -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY emailVerified -> std::bool {
          SET default := false;
      };
      CREATE PROPERTY name -> std::str;
      CREATE PROPERTY passwordHash -> std::str;
  };
  CREATE SCALAR TYPE default::SocialProvider EXTENDING enum<DISCORD, FACEBOOK, GITHUB, GOOGLE, MICROSOFT, TWITTER>;
  CREATE TYPE default::Account EXTENDING default::Timestamped {
      CREATE REQUIRED LINK user -> default::User;
      CREATE REQUIRED PROPERTY provider -> default::SocialProvider;
      CREATE REQUIRED PROPERTY providerAccountId -> std::str;
      CREATE CONSTRAINT std::exclusive ON ((.provider, .providerAccountId));
      CREATE PROPERTY accessToken -> std::str;
      CREATE PROPERTY expiresAt -> std::int32;
      CREATE PROPERTY idToken -> std::str;
      CREATE PROPERTY refreshToken -> std::str;
      CREATE PROPERTY scope -> std::str;
      CREATE PROPERTY sessionState -> std::str;
      CREATE PROPERTY tokenType -> std::str;
  };
  CREATE TYPE default::Thing EXTENDING default::Timestamped {
      CREATE REQUIRED LINK user -> default::User;
      CREATE PROPERTY description -> std::str;
      CREATE REQUIRED PROPERTY name -> std::str;
      CREATE REQUIRED PROPERTY public -> std::bool {
          SET default := false;
      };
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK accounts := (.<user[IS default::Account]);
  };
  CREATE SCALAR TYPE default::StripeStatus EXTENDING enum<incomplete, incomplete_expired, trialing, active, past_due, canceled, unpaid>;
  CREATE TYPE default::UserSubscription EXTENDING default::Timestamped {
      CREATE REQUIRED LINK user -> default::User;
      CREATE PROPERTY cancelAtPeriodEnd -> std::bool;
      CREATE PROPERTY currentPeriodEnd -> std::int32;
      CREATE PROPERTY currentPeriodStart -> std::int32;
      CREATE PROPERTY status -> default::StripeStatus;
      CREATE PROPERTY stripeCustomerId -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY stripePlanId -> std::str;
      CREATE PROPERTY stripeSubscriptionId -> std::str;
  };
  ALTER TYPE default::User {
      CREATE LINK subscription -> default::UserSubscription;
      CREATE MULTI LINK things := (.<user[IS default::Thing]);
  };
  CREATE GLOBAL default::current_user := (SELECT
      default::User
  FILTER
      (.id = GLOBAL default::current_user_id)
  );
  CREATE TYPE default::VerificationToken {
      CREATE REQUIRED PROPERTY identifier -> std::str;
      CREATE REQUIRED PROPERTY token -> std::str;
      CREATE CONSTRAINT std::exclusive ON ((.identifier, .token));
      CREATE REQUIRED PROPERTY expiresAt -> std::datetime;
  };
};
