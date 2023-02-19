create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create table admin (
    id uuid default uuid_generate_v4() primary key,
    admin_id bigint not null UNIQUE,
    name varchar not null
);

create table users (
    id uuid default uuid_generate_v4() primary key,
    username varchar not null,
    phone_number varchar not null,
    user_id bigint not null,
    active varchar(17) default 'pending'
);

CREATE TABLE services(
    id uuid default uuid_generate_v4() primary key,
    title varchar(75) not null
);

create table masters(
    id uuid default uuid_generate_v4() primary key,
    telegram_id bigint not null,
    name varchar(75) not null,
    phone_number varchar(13) not null,
    workplace_name varchar(100),
    address varchar(100),
    target varchar(100),
    latitude float not null,
    longitude float not null,
    work_starts time not null,
    work_ends time not null,
    duration interval not null,
    status varchar(17) default 'pending',
    service_id uuid,
    FOREIGN KEY(service_id)
    REFERENCES services(id)
    on delete CASCADE
);

INSERT INTO admin(admin_id, name) values(737458192, 'GuyTheDeveloper');