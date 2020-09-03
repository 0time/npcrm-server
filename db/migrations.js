/**
 * Order these in reverse version order, they get sorted later anyway.
 * Suggested rules:
 * - Database table names should be quoted, in upper camel case, and they should be singular nouns
 * - Database table field names should be lower camel case and they should be singular nouns
 * - Constraints such as foreign keys should use lower camel case
 */

module.exports = [
  {
    version: 4,
    description: 'add volunteer table',
    sql: `
    CREATE TABLE "Volunteer" (
      id BIGSERIAL NOT NULL,
      userId BIGSERIAL NOT NULL,
      PRIMARY KEY(id),
      CONSTRAINT fkVolunteerToMember FOREIGN KEY(userId) REFERENCES "Member"(id)
    )
    `,
  },
  {
    version: 3,
    description: 'add staff table',
    sql: `
    CREATE TABLE "Staff" (
      id BIGSERIAL NOT NULL,
      userId BIGSERIAL NOT NULL,
      PRIMARY KEY(id),
      CONSTRAINT fkStaffToMember FOREIGN KEY(userId) REFERENCES "Member"(id)
    )
    `,
  },
  {
    version: 2,
    description: 'add donors table',
    sql: `
    CREATE TABLE "Donor" (
      id BIGSERIAL NOT NULL,
      userId BIGSERIAL NOT NULL,
      PRIMARY KEY(id),
      CONSTRAINT fkDonorToMember FOREIGN KEY(userId) REFERENCES "Member"(id)
    )
    `,
  },
  {
    version: 1,
    description: 'add clients table',
    sql: `
    CREATE TABLE "Client" (
      id BIGSERIAL NOT NULL,
      userId BIGSERIAL NOT NULL,
      PRIMARY KEY(id),
      CONSTRAINT fkClientToMember FOREIGN KEY(userId) REFERENCES "Member"(id)
    )
    `,
  },
  {
    version: 0,
    description: 'add members table',
    sql: `
    CREATE TABLE "Member" (
      id BIGSERIAL NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      PRIMARY KEY(id)
    );
    `,
  },
];
