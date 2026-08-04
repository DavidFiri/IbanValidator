-- Active: 1785308135359@@127.0.0.1@5432@IbanValidator
CREATE TABLE banks(
    id              INTEGER         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    bank_code       CHAR(4)         NOT NULL UNIQUE,
    bank_name       VARCHAR(255)    NOT NULL
);