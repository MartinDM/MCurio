<div align="center">
  <img src="docs/logo.png" alt="MCurio Logo" width="400"/>
  
  # MCurio
  **Modern Museum Collections Management System**
  
  ![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
  ![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)
  ![Ant Design](https://img.shields.io/badge/Ant%20Design-UI-0170FE?logo=antdesign)
</div>

---

## 🏛️ What is MCurio?

MCurio is a comprehensive, web-based collections management system designed specifically for museums and cultural institutions. Built with modern web technologies, it provides everything museums need to catalog, track, and manage their collections with professional-grade features and security.

### ✨ Key Highlights

- **🔐 7-day free trial** with item-limited access (20 items)
- **👥 Multi-tenant architecture** - secure, museum-scoped data
- **📚 Complete collections management** - items, exhibitions, loans, conservation
- **🔍 Advanced search & filtering** across all metadata
- **📱 Responsive design** for desktop, tablet, and mobile use
- **💳 Affordable pricing** starting at £14/month

## 🚀 Quick Start

```bash
# Clone and install
git clone <repository-url>
cd MCurio
npm install

# Set up local development
supabase start
npm run seed:snaplet:reset

# Start developing
npm run dev
```

## 📋 Core Features

| Feature                 | Description                                                       |
| ----------------------- | ----------------------------------------------------------------- |
| **Items Management**    | Comprehensive cataloging with metadata, images, and relationships |
| **Staff & Contacts**    | Role-based access control and external stakeholder management     |
| **Exhibitions & Loans** | Track temporary displays and item movements                       |
| **Trial System**        | Automated 7-day trials with database-enforced limitations         |
| **Search & Export**     | Advanced filtering and PDF label generation                       |
| **Security**            | Row-level security (RLS) and multi-tenant data isolation          |

## 🎯 Perfect For

- **Small to Medium Museums** - Professional tools without enterprise complexity
- **Private Collections** - Organize and document personal art collections
- **Cultural Institutions** - Libraries, galleries, and historical societies
- **Trial Users** - Explore full functionality with the 7-day free trial

## 📖 Documentation

- **[📋 Complete Feature Documentation](docs/FEATURES.md)** - Comprehensive feature overview
- **🛠️ Development Setup** - See below for quick setup instructions
- **💾 Database Schema** - Multi-tenant PostgreSQL with RLS security
- **🔐 Authentication** - Supabase Auth with role-based permissions

## 🛠️ Tech Stack

**Frontend:** React 18 + TypeScript + Vite + Ant Design + Refine  
**Backend:** Supabase (PostgreSQL + Auth + RLS + Real-time)  
**Architecture:** Multi-tenant SaaS with museum-scoped data isolation

## 💳 Pricing

- **Personal Plan:** £14/month - Perfect for individual museums
- **Professional Plans:** Scaled pricing for larger institutions
- **Free Trial:** 7 days with full access (20-item limit)

---

## Development & Deployment

### Prerequisites

- Node.js 18+
- Supabase CLI
- Modern browser with JavaScript enabled

### Development Setup

1. **Install dependencies:** `npm install`
2. **Start Supabase:** `supabase start`
3. **Reset database:** `npm run seed:snaplet:reset`
4. **Run development server:** `npm run dev`
5. **Build for production:** `npm run build`

### Environment Configuration

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
MARTIN_AUTH_PASSWORD=secure_dev_password
```

## 🤝 Contributing

This project is actively developed for museum professionals. For technical support or feature requests, contact the development team.

## 📄 License

Proprietary - All rights reserved.

---

<div align="center">
  <strong>Built with ❤️ for Museums</strong><br>
  <em>Last updated: April 10, 2026 • Version 2.0.0</em>
</div>
