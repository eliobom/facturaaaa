
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  role text check (role in ('admin','seller')) not null default 'seller',
  commission numeric not null default 0,
  created_at timestamptz not null default now()
);


create or replace function public.is_admin() returns boolean
language sql stable as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;


alter table public.profiles enable row level security;


drop policy if exists profiles_self_select on public.profiles;
create policy profiles_self_select
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- Catálogo
create table if not exists public.bodegas (
  id uuid primary key default gen_random_uuid(),
  codigo text unique not null,
  nombre text not null,
  ciudad text,
  direccion text,
  activa boolean not null default true,
  created_at timestamptz not null default now()
);

-- Productos
create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  codigo text unique not null,
  nombre text not null,
  descripcion text,
  precio numeric not null check (precio >= 0),
  stock integer not null default 0, -- opcional como cache global
  categoria text,
  imagen text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- Categorías
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  descripcion text,
  created_at timestamptz not null default now()
);

-- Proveedores
create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  telefono text,
  email text,
  direccion text,
  created_at timestamptz not null default now()
);

-- Relación producto-proveedor
create table if not exists public.product_suppliers (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references public.productos(id) on delete cascade,
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  cost numeric check (cost >= 0),
  unique (producto_id, supplier_id)
);

-- Inventario 
-- Stock por bodega y producto
create table if not exists public.product_stock (
  id uuid primary key default gen_random_uuid(),
  bodega_id uuid not null references public.bodegas(id) on delete cascade,
  producto_id uuid not null references public.productos(id) on delete cascade,
  stock integer not null default 0,
  min_stock integer not null default 0,
  unique (bodega_id, producto_id)
);

-- Movimientos de stock
create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('in','out','transfer')),
  producto_id uuid not null references public.productos(id) on delete restrict,
  from_bodega_id uuid references public.bodegas(id) on delete set null,
  to_bodega_id uuid references public.bodegas(id) on delete set null,
  quantity integer not null check (quantity > 0),
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Ventas 
-- Clientes
create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  documento text,
  telefono text,
  email text,
  direccion text,
  created_at timestamptz not null default now()
);

-- Ventas
create table if not exists public.ventas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references public.clientes(id) on delete set null,
  vendedor_id uuid references public.profiles(id) on delete set null,
  total numeric not null check (total >= 0),
  estado text not null default 'completada',
  fecha timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Detalle de venta
create table if not exists public.venta_items (
  id uuid primary key default gen_random_uuid(),
  venta_id uuid not null references public.ventas(id) on delete cascade,
  producto_id uuid not null references public.productos(id) on delete restrict,
  cantidad integer not null check (cantidad > 0),
  precio_unitario numeric not null check (precio_unitario >= 0),
  subtotal numeric not null generated always as (cantidad * precio_unitario) stored
);

-- Índices recomendados
create index if not exists ventas_fecha_idx on public.ventas (fecha desc);
create index if not exists ventas_cliente_idx on public.ventas (cliente_id);
create index if not exists venta_items_venta_idx on public.venta_items (venta_id);
create index if not exists venta_items_producto_idx on public.venta_items (producto_id);
create index if not exists clientes_nombre_idx on public.clientes (nombre);
create index if not exists clientes_documento_idx on public.clientes (documento);
create index if not exists product_stock_bodega_prod_idx on public.product_stock (bodega_id, producto_id);

--  RLS 
-- Habilitar RLS
alter table public.bodegas enable row level security;
alter table public.productos enable row level security;
alter table public.product_stock enable row level security;
alter table public.stock_movements enable row level security;
alter table public.categories enable row level security;
alter table public.suppliers enable row level security;
alter table public.product_suppliers enable row level security;
alter table public.clientes enable row level security;
alter table public.ventas enable row level security;
alter table public.venta_items enable row level security;

-- Lectura para autenticados; admin puede todo
-- Bodegas
drop policy if exists bodegas_read_auth on public.bodegas;
create policy bodegas_read_auth on public.bodegas for select using (auth.uid() is not null);

drop policy if exists bodegas_admin_all on public.bodegas;
create policy bodegas_admin_all on public.bodegas for all using (public.is_admin()) with check (public.is_admin());

-- Productos
drop policy if exists productos_read_auth on public.productos;
create policy productos_read_auth on public.productos for select using (auth.uid() is not null);

drop policy if exists productos_admin_all on public.productos;
create policy productos_admin_all on public.productos for all using (public.is_admin()) with check (public.is_admin());

-- Product Stock
drop policy if exists product_stock_read_auth on public.product_stock;
create policy product_stock_read_auth on public.product_stock for select using (auth.uid() is not null);

drop policy if exists product_stock_admin_all on public.product_stock;
create policy product_stock_admin_all on public.product_stock for all using (public.is_admin()) with check (public.is_admin());

-- Stock Movements
drop policy if exists stock_movements_read_auth on public.stock_movements;
create policy stock_movements_read_auth on public.stock_movements for select using (auth.uid() is not null);

drop policy if exists stock_movements_admin_all on public.stock_movements;
create policy stock_movements_admin_all on public.stock_movements for all using (public.is_admin()) with check (public.is_admin());

-- Categories
drop policy if exists categories_read_auth on public.categories;
create policy categories_read_auth on public.categories for select using (auth.uid() is not null);

drop policy if exists categories_admin_all on public.categories;
create policy categories_admin_all on public.categories for all using (public.is_admin()) with check (public.is_admin());

-- Suppliers
drop policy if exists suppliers_read_auth on public.suppliers;
create policy suppliers_read_auth on public.suppliers for select using (auth.uid() is not null);

drop policy if exists suppliers_admin_all on public.suppliers;
create policy suppliers_admin_all on public.suppliers for all using (public.is_admin()) with check (public.is_admin());

-- Product Suppliers
drop policy if exists product_suppliers_read_auth on public.product_suppliers;
create policy product_suppliers_read_auth on public.product_suppliers for select using (auth.uid() is not null);

drop policy if exists product_suppliers_admin_all on public.product_suppliers;
create policy product_suppliers_admin_all on public.product_suppliers for all using (public.is_admin()) with check (public.is_admin());

-- Clientes
drop policy if exists clientes_read_auth on public.clientes;
create policy clientes_read_auth on public.clientes for select using (auth.uid() is not null);

drop policy if exists clientes_admin_all on public.clientes;
create policy clientes_admin_all on public.clientes for all using (public.is_admin()) with check (public.is_admin());

-- Ventas
drop policy if exists ventas_read_auth on public.ventas;
create policy ventas_read_auth on public.ventas for select using (auth.uid() is not null);

drop policy if exists ventas_admin_all on public.ventas;
create policy ventas_admin_all on public.ventas for all using (public.is_admin()) with check (public.is_admin());

-- Venta Items
drop policy if exists venta_items_read_auth on public.venta_items;
create policy venta_items_read_auth on public.venta_items for select using (auth.uid() is not null);

drop policy if exists venta_items_admin_all on public.venta_items;
create policy venta_items_admin_all on public.venta_items for all using (public.is_admin()) with check (public.is_admin());

--RPCs 
-- Transferir stock entre bodegas
create or replace function public.transfer_stock(
  p_producto_id uuid,
  p_from_bodega_id uuid,
  p_to_bodega_id uuid,
  p_quantity integer,
  p_note text
) returns void
language plpgsql
security definer
as $$
declare
  v_from_row public.product_stock%rowtype;
  v_to_row public.product_stock%rowtype;
begin
  if not public.is_admin() then
    raise exception 'only admin can transfer stock';
  end if;

  if p_quantity is null or p_quantity <= 0 then
    raise exception 'quantity must be > 0';
  end if;
  if p_from_bodega_id = p_to_bodega_id then
    raise exception 'from and to bodega must be different';
  end if;

  insert into public.product_stock (bodega_id, producto_id, stock)
  values (p_from_bodega_id, p_producto_id, 0)
  on conflict (bodega_id, producto_id) do nothing;

  insert into public.product_stock (bodega_id, producto_id, stock)
  values (p_to_bodega_id, p_producto_id, 0)
  on conflict (bodega_id, producto_id) do nothing;

  select * into v_from_row
  from public.product_stock
  where bodega_id = p_from_bodega_id and producto_id = p_producto_id
  for update;

  select * into v_to_row
  from public.product_stock
  where bodega_id = p_to_bodega_id and producto_id = p_producto_id
  for update;

  if v_from_row.stock < p_quantity then
    raise exception 'insufficient stock in source warehouse (% < %)', v_from_row.stock, p_quantity;
  end if;

  update public.product_stock
    set stock = stock - p_quantity
  where id = v_from_row.id;

  update public.product_stock
    set stock = stock + p_quantity
  where id = v_to_row.id;

  insert into public.stock_movements (
    type, producto_id, from_bodega_id, to_bodega_id,
    quantity, note, created_by
  ) values (
    'transfer', p_producto_id, p_from_bodega_id, p_to_bodega_id,
    p_quantity, p_note, auth.uid()
  );
end;
$$;

-- KPIs de ventas (requieren tablas ventas/venta_items)
create or replace function public.ventas_hoy_total()
returns numeric
language sql stable
as $$
  select coalesce(sum(v.total), 0)
  from public.ventas v
  where v.fecha::date = now()::date
$$;

create or replace function public.ventas_mes_total()
returns numeric
language sql stable
as $$
  select coalesce(sum(v.total), 0)
  from public.ventas v
  where date_trunc('month', v.fecha) = date_trunc('month', now())
$$;

create or replace function public.ventas_recientes(p_limit int default 5)
returns setof public.ventas
language sql stable
as $$
  select * from public.ventas order by fecha desc limit p_limit
$$;

create or replace function public.clientes_total()
returns bigint
language sql stable
as $$
  select count(*) from public.clientes
$$;
