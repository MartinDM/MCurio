# MCurio Schema Fix - Comprehensive Restoration Guide

## Context

**MCurio** is a React + TypeScript + Vite + Ant Design + Refine + Supabase museum CMS. A database migration changed the profile schema from `role_id` + `is_admin` columns to a single `role` text column, but several UI components weren't updated, causing **broken authentication and profile displays**.

## Critical Issues to Fix

### 1. **Authentication Provider - BROKEN**

**File:** `src/providers/auth.ts`  
**Lines:** 7, 17

**Problem:** Still querying removed database columns  
**Required Changes:**

```typescript
// Line 7 - Change from:
.select("museum_id, role_id, is_admin")
// To:
.select("museum_id, role")

// Line 17 - Change from:
isAdmin: profile.is_admin || profile.role_id === "admin",
// To:
isAdmin: profile.role === "admin",
```

### 2. **Items List Page - BROKEN**

**File:** `src/routes/items/list/index.tsx`  
**Lines:** 73, 263

**Required Changes:**

```typescript
// Line 73 - Change GraphQL select from:
"*, owner:owner_id(id, display_name, role_id, is_admin), contact:contact_id(id, name, organization)";
// To:
"*, owner:owner_id(id, display_name, role), contact:contact_id(id, name, organization)";

// Line 263 - Change role display from:
{
  owner.is_admin ? "Admin" : owner.role_id || "User";
}
// To:
{
  owner.role || "User";
}
```

### 3. **Items Edit Form - BROKEN**

**File:** `src/routes/items/edit/form.tsx`  
**Lines:** 510-512

**Required Changes:**

```typescript
// Change owner option display from:
{
  option.data?.is_admin ? "Admin" : option.data?.role_id || "User";
}
// To:
{
  option.data?.role || "User";
}
```

### 4. **Items Create Modal - BROKEN**

**File:** `src/routes/items/list/create-modal.tsx`  
**Lines:** 132-134

**Apply same role display fix as Items Edit Form**

### 5. **Profile Management (if exists)**

**File:** `src/routes/profiles/index.tsx`  
**Check for:** `role_id` references and update to `role`

## Database Schema Context

- **Old schema:** `profiles` had `role_id` (UUID FK) + `is_admin` (boolean)
- **New schema:** `profiles` has `role` (text) with values: 'admin', 'editor', 'viewer'
- **Migration applied:** `20260409120000_roles_refactor_and_trial_system.sql`

## What's Still Working (Don't Touch)

✅ **Movement Tracking**: `MovementCreateModal`, `MovementHistoryModal`  
✅ **Exhibition Management**: `ExhibitionItemModal`  
✅ **Museum Scoping**: Data provider with museum_id injection  
✅ **UI Components**: Movement/exhibition buttons and modals

## Verification Steps

1. **Test login** - Should not get 400 errors
2. **Check items list** - Owner roles should display correctly
3. **Test item editing** - Owner dropdown should show roles properly
4. **Verify profile access** - Admin users should have proper permissions

## Implementation Priority

1. **Auth provider** (blocks login)
2. **Items list** (most visible UI issue)
3. **Items forms** (creation/editing)
4. **Profile management** (admin features)

## Success Criteria

- [ ] Login works without 400 errors
- [ ] Items list shows correct owner roles
- [ ] Item owner dropdowns display roles correctly
- [ ] Profile management uses `role` column
- [ ] All movement tracking and exhibition features still functional

**Goal:** Restore full authentication and profile functionality while preserving all existing movement tracking and exhibition management features.
