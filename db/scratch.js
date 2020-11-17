/**
 * Order these in reverse version order.
 * Suggested rules:
 * - Database table names should be quoted, in upper camel case, and they should be singular nouns
 * - Database table field names should be lower camel case and they should be singular nouns
 * - Constraints such as foreign keys should use lower camel case
 */

const reverse = (inp) => inp.reverse();

module.exports = reverse([
  `
    CREATE TABLE "Volunteer" (
      id BIGSERIAL NOT NULL,
      userId BIGSERIAL NOT NULL,
      PRIMARY KEY(id),
      CONSTRAINT fkVolunteerToMember FOREIGN KEY(userId) REFERENCES "Member"(id)
    );
  `,
  `
    CREATE TABLE "Staff" (
      id BIGSERIAL NOT NULL,
      userId BIGSERIAL NOT NULL,
      PRIMARY KEY(id),
      CONSTRAINT fkStaffToMember FOREIGN KEY(userId) REFERENCES "Member"(id)
    );
  `,
  `
    CREATE TABLE "Donor" (
      id BIGSERIAL NOT NULL,
      userId BIGSERIAL NOT NULL,
      PRIMARY KEY(id),
      CONSTRAINT fkDonorToMember FOREIGN KEY(userId) REFERENCES "Member"(id)
    );
  `,
  `
    CREATE TABLE "Client" (
      id BIGSERIAL NOT NULL,
      userId BIGSERIAL NOT NULL,
      PRIMARY KEY(id),
      CONSTRAINT fkClientToMember FOREIGN KEY(userId) REFERENCES "Member"(id)
    );
  `,
  `
    CREATE TABLE "Member" (
      id BIGSERIAL NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      PRIMARY KEY(id)
    );
  `,
]);
