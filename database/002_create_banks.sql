-- Active: 1785308135359@@127.0.0.1@5432@IbanValidator
CREATE TABLE banks(
    bank_code       CHAR(4)         PRIMARY KEY,
    bank_name       VARCHAR(255)    NOT NULL
);