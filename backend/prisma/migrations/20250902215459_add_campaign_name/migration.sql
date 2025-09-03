-- 1) Ajouter la colonne avec un DEFAULT temporaire
ALTER TABLE "Campaign" ADD COLUMN "name" TEXT;

-- 2) Backfill: mettre un nom pour les lignes existantes (ex: 'Untitled cmf3327')
UPDATE "Campaign"
SET "name" = 'Untitled ' || substr("id", 1, 6)
WHERE "name" IS NULL;

-- 3) Rendre NOT NULL
ALTER TABLE "Campaign" ALTER COLUMN "name" SET NOT NULL;

-- (Optionnel) Si tu veux empêcher les doublons par annonceur
-- CREATE UNIQUE INDEX "Campaign_advertiserId_name_unique"
--   ON "Campaign" ("advertiserId","name");
