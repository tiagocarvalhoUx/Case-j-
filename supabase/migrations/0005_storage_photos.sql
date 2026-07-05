-- ============================================================
-- Case-já — Migration 0005: Storage para upload de fotos
-- Cria o bucket público "photos" e as regras de acesso:
-- cada usuário só grava/apaga dentro da própria pasta (auth.uid()).
-- Aplicar no Supabase: SQL Editor → colar → Run.
-- ============================================================

-- Bucket público (leitura via CDN; escrita controlada por policy)
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- Upload: somente autenticado, somente na pasta com o próprio uid
drop policy if exists "photos_upload_own_folder" on storage.objects;
create policy "photos_upload_own_folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Exclusão: somente o dono da pasta
drop policy if exists "photos_delete_own_folder" on storage.objects;
create policy "photos_delete_own_folder" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
