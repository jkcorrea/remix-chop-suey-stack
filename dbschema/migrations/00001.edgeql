CREATE MIGRATION m14k2xcrniv6becpos3rjacvaiopzpwtpgop3sxrkkqphojvqafmka
    ONTO initial
{
  CREATE TYPE default::Profile {
      CREATE REQUIRED PROPERTY alias -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY userId -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE default::Thing {
      CREATE REQUIRED LINK owner -> default::Profile;
      CREATE PROPERTY description -> std::str;
      CREATE REQUIRED PROPERTY name -> std::str;
  };
};
