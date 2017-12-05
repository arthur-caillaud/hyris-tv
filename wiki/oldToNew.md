# Move

Penser a désactiver la structure.

Videos -> Video
```SQL
SELECT titre, NULL as tag, url as nom_video, description, videos.date as `date`, 0 as is_diff, 1 as is_private, 1 as id_user, 0 as score, 1 as id_image, id FROM `videos` WHERE 1
```
Remplacer :
+ `url` par `nom_video`
+ `videos` par `Video`

```sql
SELECT url as titre,date,(id + 1000) as id FROM `videos` INNER JOIN image__exist ON nom = url WHERE 1
```

```sql
SELECT titre, GROUP_CONCAT(tags.name SEPARATOR ' ') as tag, url as nom_video, description, videos.date as `date`, 0 as is_diff, is_exterieur as is_private, 0 as id_user, 0 as score, (1000 + videos.id) as id_image, 10 as time_pict, videos.id FROM `videos` INNER JOIN image__exist ON nom = url JOIN tags_videos ON video_id = videos.id JOIN tags ON tags.id = tag_id WHERE 1 GROUP BY videos.id
UNION
SELECT titre, GROUP_CONCAT(tags.name SEPARATOR ' ') as tag, url as nom_video, description, videos.date as `date`, 0 as is_diff, is_exterieur as is_private, 0 as id_user, 0 as score, 0 as id_image, 10 as time_pict, videos.id FROM `videos` JOIN tags_videos ON video_id = videos.id JOIN tags ON tags.id = tag_id WHERE videos.id not in (SELECT id FROM videos INNER JOIN image__exist ON nom = url) GROUP BY videos.id
```

```sql
SELECT CONCAT(url, '.jpg') AS nom_image, videos.date as date,(1000 + videos.id) as id FROM `videos`,image__exist WHERE nom = url
```
