# Database diagram

![Database diagram](/docs/img/db_diag.png)

### yUML code
```
[User | id : Integer; username : varchar(64); displayName : varchar(64); bioDescription : varchar(128); email : varchar(255); passwordHash: varchar]1-*>[Post | id : integer; authorId : integer; textContent : varchar; imageUrl : varchar], [User | id : Integer; username : varchar(64); displayName : varchar(64); bioDescription : varchar(128); email : varchar(255); passwordHash: varchar]1-*>[Comment | id : integer; postId : integer; userId : integer; content : varchar], [Post | id : integer;  authorId : integer; textContent : varchar; imageUrl : varchar]1-*>[Comment | id : integer; postId : integer; userId : integer; content : varchar], [Post | id : integer;  authorId : integer; textContent : varchar; imageUrl : varchar]1-*>[Like |id : integer; postId : integer; userId : integer], [User | id : Integer; username : varchar(64); displayName : varchar(64); bioDescription : varchar(128); email : varchar(255); passwordHash: varchar]1-*>[Like |id : integer; postId : integer; userId : integer]
[Token | id : integer; userId : integer; value : varchar]1-1>[User | id : Integer; username : varchar(64); displayName : varchar(64); bioDescription : varchar(128); email : varchar(255); passwordHash: varchar]
```