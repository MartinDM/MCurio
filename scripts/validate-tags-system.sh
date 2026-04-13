#!/bin/bash
# Validation script to test the new tags system
echo "🏛️  MCurio - Validating Tags System"
echo "=================================="

echo "🔍 Testing database structure..."

# Test that tables exist
echo "✅ Checking tables exist..."
supabase db execute --query "
SELECT 
    schemaname, 
    tablename, 
    tableowner 
FROM pg_tables 
WHERE tablename IN ('tags', 'item_tags') 
AND schemaname = 'public';
" --format table

echo ""
echo "📊 Current tags summary:"
supabase db execute --query "
SELECT 
    COUNT(*) as total_tags,
    COUNT(DISTINCT museum_id) as museums_with_tags
FROM tags;
" --format table

echo ""
echo "🔗 Item-tag relationships:"
supabase db execute --query "
SELECT 
    COUNT(*) as total_relationships,
    COUNT(DISTINCT item_id) as items_with_tags,
    COUNT(DISTINCT tag_id) as unique_tags_used
FROM item_tags;
" --format table

echo ""
echo "🎨 Sample tags (if any):"
supabase db execute --query "
SELECT 
    name, 
    color, 
    description,
    (SELECT COUNT(*) FROM item_tags WHERE tag_id = tags.id) as usage_count
FROM tags 
ORDER BY name 
LIMIT 10;
" --format table

echo ""
echo "🏷️  Items with most tags:"
supabase db execute --query "
SELECT 
    i.title,
    i.item_type,
    COUNT(it.tag_id) as tag_count,
    STRING_AGG(t.name, ', ' ORDER BY t.name) as tag_names
FROM items i
LEFT JOIN item_tags it ON i.id = it.item_id  
LEFT JOIN tags t ON it.tag_id = t.id
GROUP BY i.id, i.title, i.item_type
HAVING COUNT(it.tag_id) > 0
ORDER BY tag_count DESC
LIMIT 5;
" --format table

echo ""
echo "🔍 Checking for any remaining text tags (should be empty):"
supabase db execute --query "
SELECT COUNT(*) as items_with_old_text_tags
FROM items 
WHERE tags IS NOT NULL AND array_length(tags, 1) > 0;
" --format table

echo ""
echo "✅ Validation complete!"
echo ""
echo "💡 To test the frontend:"
echo "1. Navigate to /tags to manage tag entities"
echo "2. Edit an item and try adding tags"
echo "3. Verify colorized tag display"
echo "4. Check that tags autocomplete properly"