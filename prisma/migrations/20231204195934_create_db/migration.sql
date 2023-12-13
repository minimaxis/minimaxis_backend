-- CreateTable
CREATE TABLE "usuario" (
    "user_id" VARCHAR(36) NOT NULL,
    "email_user" VARCHAR(255) NOT NULL,
    "password_user" VARCHAR(1024) NOT NULL,
    "descricao_user" VARCHAR(36) NOT NULL,
    "nivel_id" VARCHAR(36),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "bloqueado" BOOLEAN NOT NULL DEFAULT false,
    "on_line" BOOLEAN NOT NULL DEFAULT false,
    "replicar" BOOLEAN NOT NULL DEFAULT false,
    "log_data_rep" TIMESTAMPTZ(6),
    "log_data_cad" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "log_user_cad" VARCHAR(36) NOT NULL,
    "log_data_alt" TIMESTAMPTZ(6),
    "log_user_alt" VARCHAR(36),
    "term_cad" VARCHAR(36),
    "term_alt" VARCHAR(36),
    "permitido_edit_del" BOOLEAN NOT NULL DEFAULT true,
    "permitido" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "pk_usuario" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_user_key" ON "usuario"("email_user");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "fk_usuario_log_user_cad" FOREIGN KEY ("log_user_cad") REFERENCES "usuario"("user_id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "fk_usuario_log_user_alt" FOREIGN KEY ("log_user_alt") REFERENCES "usuario"("user_id") ON DELETE NO ACTION ON UPDATE CASCADE;
