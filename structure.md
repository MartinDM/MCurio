# Museum CMS Entity Structure

This document outlines the core entities for the Museum CMS, implemented in Supabase (PostgreSQL).

## Item (Art/Objects)

Combines art pieces and objects for flexibility.

- id: UUID (primary key)
- title: Text (required, for Art)
- name: Text (for Objects, optional alternative to title)
- artist: Text (Artist/Creator)
- medium: Text (e.g., "oil on canvas" or "marble")
- year: Integer (Creation year)
- description: Text
- acquisition_date: Date
- exhibition_id: UUID (references Exhibition)
- created_at: Timestamp
- updated_at: Timestamp

## Exhibition

- id: UUID (primary key)
- name: Text (required)
- start_date: Date
- end_date: Date
- status: Text (planned, current, past)
- description: Text
- created_at: Timestamp
- updated_at: Timestamp

## Contact

- id: UUID (primary key)
- name: Text (required)
- email: Text
- phone: Text
- type: Text (academic, private, corporate, other_museum, staff_member)
- organization: Text
- notes: Text
- created_at: Timestamp
- updated_at: Timestamp

## Condition Report

(Formerly "Inspection Note")

- id: UUID (primary key)
- item_id: UUID (required, references Item)
- contact_id: UUID (optional, references Contact for inspector)
- date: Date (required)
- status: Text (excellent, stable, needs_attention)
- notes: Text
- temperature: Decimal (optional, environmental data)
- humidity: Decimal (optional)
- created_at: Timestamp
- updated_at: Timestamp

## Museum (Optional, for future expansion)

- id: UUID (primary key)
- name: Text (required)
- address: Text
- city: Text
- state: Text
- country: Text
- postal_code: Text
- email: Text
- phone: Text
- description: Text
- contact_person: Text
- contact_person_email: Text
- contact_person_phone: Text
- established_year: Integer
- specializations: Text
- notes: Text
- lead_curator_id: UUID (references Contact)

## Provenance (Optional)

- id: UUID (primary key)
- details: Text
- item_id: UUID (references Item)

## Display History (Optional)

- id: UUID (primary key)
- location: Text
- date: Date
- item_id: UUID (references Item)

## Image

- id: UUID (primary key)
- url: Text (required)
- item_id: UUID (references Item)
- object_id: UUID (references Item, for Objects)
