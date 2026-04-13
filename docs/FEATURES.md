# MCurio Feature Documentation

## ✨ Comprehensive Feature Set

### 🔐 Authentication & Trial System

- **7-day free trial** for new museums with automatic countdown
- **Item limitations during trial** (20 items maximum)
- **Database-enforced trial restrictions** via triggers
- **Role-based access control** (admin, curator, viewer, no-access)
- **Multi-tenant architecture** with museum-scoped data isolation
- **Secure authentication** via Supabase Auth

### 🏛️ Museum & Staff Management

- **Museum profiles** with comprehensive settings and information
- **Staff management** with role assignments and display names
- **4-step onboarding flow** for new museum setup:
  1. Create museum profile
  2. Set up initial staff
  3. Add first collections
  4. Configure preferences
- **Trial status tracking** with upgrade prompts and countdown timers

### 📚 Advanced Collections Management

#### Item Cataloging

- **Comprehensive metadata capture**:
  - Title, artist, medium, dimensions, creation dates
  - Custom properties and structured tags
  - Rich text descriptions with Markdown support
  - Image attachments and avatar generation
- **Item types**: Art pieces, objects, photographs, documents
- **Advanced search and filtering** across all metadata fields

#### Item Ownership System

- **Internal ownership**: Each item must be assigned to a staff member (mandatory)
- **External contacts**: Optional association with donors, lenders, artists via dedicated field
- **Inline contact creation**: Create new contacts directly from item forms with full modal
- **Rich staff/contact display**: Shows role, email, and organization in dropdowns
- **Ownership tracking** and responsibility management
- **Default owner assignment** to current user for new items

### 👥 Contact & Profile Management

#### Contact Database

- **External stakeholder management**:
  - Donors, lenders, artists, curators, researchers
  - Organization affiliations and contact details
  - Contact type categorization (Academic, Private, Corporate, Other Museum, Staff Member)
- **Inline contact creation** with full form modal from item management
- **Rich contact profiles** with comprehensive details
- **Contact-item relationships** via dedicated external contact field

#### Staff Profiles

- **Detailed staff information**:
  - Display names and role visibility
  - Email integration with authentication system
  - Professional roles and permissions
- **Profile detail pages** showing:
  - Complete contact information
  - Current role and museum association
  - Items owned and associated projects
  - Activity and contribution tracking

### 🏢 Location & Movement Tracking

- **Hierarchical location management** with detailed organization
- **Location types**: Storage, gallery, conservation lab, external, on loan, in transit
- **Real-time item location tracking** and movement history
- **Inline location creation** directly from item management forms with full modal
- **Location-based reporting** and inventory management

### 🎨 Exhibitions & Loans

#### Exhibition Management

- **Comprehensive exhibition planning** and tracking
- **Date management** for temporary and permanent displays
- **Item association** and exhibition cataloging
- **Exhibition status tracking** (planned, active, completed)
- **Exhibition item management** with detailed tracking

#### Loan Tracking

- **Incoming and outgoing loan management**
- **Rich loan creation** with inline modal from item forms
- **Loan period tracking** with date management
- **Borrower and lender contact management**
- **Loan status tracking** (draft, active, extended, returned, overdue, cancelled)
- **One loan per item** constraint with automatic relationship management

### 🔍 Advanced Search & Data Management

#### Search Capabilities

- **Full-text search** across item titles, descriptions, and metadata
- **Advanced filtering** by type, properties, location, owner, dates
- **Semantic search** for intelligent content discovery
- **Saved searches** and custom views

#### Tags & Properties System

- **Entity-based tagging** with color coding and descriptions
- **Many-to-many tag relationships** for flexible categorization
- **Tag management interface** with autocomplete and visual indicators
- **Custom properties** for institution-specific metadata
- **Automated tag migration** from legacy text arrays

### 📊 Reporting & Documentation

#### Condition & Conservation

- **Condition reports** with detailed conservation tracking
- **Conservation history** and treatment documentation
- **Automated condition monitoring** and alert systems
- **Professional conservation workflow support**

#### Export & Documentation

- **PDF label generation** for physical item identification
- **Custom report generation** with flexible filtering
- **Data export capabilities** for external systems
- **Comprehensive audit trails** for all changes

### 💳 Pricing & Business Model

- **Personal Plan**: £14/month for up to 2 users (£154 annually - save 1 month)
  - Additional users: £7/month each
- **Museum Plan**: £55/month for up to 3 users (£605 annually - save 1 month)
  - Additional users: £7/month each
- **Enterprise Solutions**: Custom pricing for major museums
- **Free trial period** with full feature access

## 💾 Database Architecture

### Core Schema

```sql
-- Key tables and relationships
profiles              -- Staff members with roles and museum associations
museums               -- Institution information and trial status
items                 -- Collection objects with comprehensive metadata
contacts              -- External stakeholders and relationships
locations             -- Physical and virtual storage locations
exhibitions           -- Temporary displays and permanent collections
loans                 -- Incoming and outgoing item loans
tags                  -- Entity-based tagging system
item_tags             -- Many-to-many item-tag relationships
```

### Advanced Features

- **Row Level Security (RLS)** for multi-tenant data protection
- **Database triggers** for business rule enforcement
- **Trial period automation** with automatic restriction enforcement
- **Real-time subscriptions** for collaborative workflows
- **Audit logging** for compliance and tracking

## 📋 Database Migration History

The system includes comprehensive database migrations tracking feature evolution:

1. **Initial Schema** (`20260321223454_init_schema.sql`) - Core tables and relationships
2. **Enhanced RLS Policies** (`20260321223905_add_rls_policies.sql`) - Multi-tenant security
3. **Roles Refactor & Trial System** (`20260409120000_roles_refactor_and_trial_system.sql`) - Trial enforcement and simplified roles
4. **Item Ownership & Display Names** (`20260410120000_add_item_ownership_and_display_names.sql`) - Advanced ownership tracking

## 🎯 Trial System Details

### Automated Trial Management

- **7-day trial period** from museum creation date
- **20-item limit** during trial with real-time enforcement
- **Database-level restrictions** preventing limit violations
- **Visual countdown timers** and upgrade prompts
- **Automatic trial expiration** handling with grace periods

### Business Logic Enforcement

- **Database triggers** prevent exceeding trial limits
- **Real-time status calculation** across all interfaces
- **Seamless upgrade path** to paid plans
- **Trial extension capabilities** for special circumstances

## 📱 User Experience

### Responsive Design

- **Mobile-first approach** for field work and remote access
- **Touch-optimized interfaces** for tablet-based inventory
- **Progressive Web App** capabilities for offline access
- **Accessibility compliance** with WCAG guidelines

### Workflow Optimization

- **Contextual navigation** with breadcrumbs and quick actions
- **Bulk operations** for efficient collection management
- **Keyboard shortcuts** for power users
- **Unsaved changes warnings** preventing data loss

## 🚦 Development Status

### 🚦 Development Status

### ✅ Recently Completed (April 2026)

- **Enhanced contact management** with inline creation modals
- **Item ownership system** with mandatory internal owner and optional external contact
- **Rich contact/staff dropdowns** with role and organization display
- **Loan creation system** with one-loan-per-item constraint
- **Location management** with inline creation capabilities
- **Profile detail pages** with associated items tracking
- **Trial countdown system** with database enforcement
- **Simplified role system** (text-based: admin, editor, viewer)
- **Dynamic tab titles** with entity-specific page names

### 🔄 Active Development

- Advanced reporting dashboard
- Bulk import/export capabilities
- Enhanced mobile responsiveness
- Integration API for external systems

### 📋 Roadmap

- Conservation workflow automation
- Advanced image management with AI tagging
- Integration with external collection databases
- Mobile application for field data collection
- Advanced analytics and insights

---

_Last updated: April 11, 2026_
_Version: 2.1.0 - Enhanced Contact & Ownership Management_
