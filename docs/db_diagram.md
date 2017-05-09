# Database diagram

![Database diagram](/docs/img/db_diag.png)

### yUML code
```
[User | id : Integer; username : varchar(64); display_name : varchar(64); bio_description : varchar(128); email : varchar(255); password_hash: varchar]1-*>[Post | id : integer; text_content : varchar; image_url : varchar]
[User | id : Integer; username : varchar(64); display_name : varchar(64); bio_description : varchar(128); email : varchar(255); password_hash: varchar]1-*>[Comment | id : integer; post_id : integer; user_id : integer; content : varchar]
[Post | id : integer; text_content : varchar; image_url : varchar]1-*>[Comment | id : integer; post_id : integer; user_id : integer; content : varchar]
[Post | id : integer; text_content : varchar; image_url : varchar]1-*>[Like |id : integer; post_id : integer; user_id : integer]
[User | id : Integer; username : varchar(64); display_name : varchar(64); bio_description : varchar(128); email : varchar(255); password_hash: varchar]1-*>[Like |id : integer; post_id : integer; user_id : integer]
```