module default {
  type Profile {
    required property alias -> str {
      constraint exclusive;
    };

    required property userId -> str {
      constraint exclusive;
    };
  }

  type Thing {
    required property name -> str;
    property description -> str;

    required link owner -> Profile;
  }
}
