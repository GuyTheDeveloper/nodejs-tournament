create extension if not exists 'uuid-ossp';

create table admins (
    id uuid default uuid_generate_v4() primary key,
    name varchar(66) not null,
    password varchar(64) not null
);

create table users (
    id uuid default uuid_generate_v4() primary key,
    user_id int not null,
);