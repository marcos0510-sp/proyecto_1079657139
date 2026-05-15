CREATE TABLE IF NOT EXISTS users (
  id                   UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  name                 VARCHAR(100) NOT NULL,
  email                VARCHAR(255) UNIQUE NOT NULL,
  password_hash        TEXT,                  -- null hasta activar la cuenta
  is_active            BOOLEAN      DEFAULT false,  -- false hasta verificar invitación
  login_attempts       INTEGER      DEFAULT 0,
  locked_until         TIMESTAMPTZ,
  must_change_password BOOLEAN      DEFAULT false,
  last_login_at        TIMESTAMPTZ,
  created_at           TIMESTAMPTZ  DEFAULT NOW()
);

-- Tokens de invitación/activación (24h de vigencia)
CREATE TABLE IF NOT EXISTS invitation_tokens (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token       VARCHAR(64) UNIQUE NOT NULL,
  farm_id     UUID,               -- finca a la que se está invitando (null para primer Propietario)
  role        VARCHAR(15),        -- rol asignado en la invitación
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS _migrations (
  id         SERIAL       PRIMARY KEY,
  filename   VARCHAR(255) UNIQUE NOT NULL,
  applied_at TIMESTAMPTZ  DEFAULT NOW()
);