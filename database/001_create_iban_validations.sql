CREATE TABLE iban_validations (
    iban                CHAR(24)        PRIMARY KEY,
    bank_code           CHAR(4)         NOT NULL REFERENCES banks(bank_code),
    first_checked_at    TIMESTAMPTZ     NOT NULL DEFAULT now(), 
    last_checked_at     TIMESTAMPTZ     NOT NULL DEFAULT now(),
    check_count         INTEGER         NOT NULL DEFAULT 1 
);