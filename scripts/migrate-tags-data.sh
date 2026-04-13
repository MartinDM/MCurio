#!/bin/bash
# Data migration script to convert existing text tags to proper tag entities
# Run this after the database schema migration is applied

echo "🏛️  MCurio - Converting existing item tags to tag entities"
echo "========================================================"

# Check if we're connected to Supabase
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first."
    exit 1
fi

echo "🔍 Checking for existing text tags in items..."

# First, let's see what tags exist
supabase db execute --query "
SELECT DISTINCT unnest(tags) as tag_name, COUNT(*) 
FROM items 
WHERE tags IS NOT NULL AND array_length(tags, 1) > 0 
GROUP BY tag_name 
ORDER BY COUNT(*) DESC;
" --format table

echo ""
read -p "Do you want to proceed with converting these tags to tag entities? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Converting tags to entities..."
    
    # The migration function should have already run, but let's make sure
    supabase db execute --query "
    -- Check if migration function still exists and run it if needed
    DO \$\$
    BEGIN
        -- Check if any items still have text tags that aren't migrated
        IF EXISTS (
            SELECT 1 FROM items 
            WHERE tags IS NOT NULL 
            AND array_length(tags, 1) > 0
            AND id NOT IN (
                SELECT DISTINCT item_id FROM item_tags
            )
        ) THEN
            -- Re-run the migration logic
            DECLARE
                item_record RECORD;
                tag_name text;
                tag_id uuid;
            BEGIN
                FOR item_record IN 
                    SELECT id, museum_id, tags 
                    FROM items 
                    WHERE tags IS NOT NULL AND array_length(tags, 1) > 0
                LOOP
                    FOREACH tag_name IN ARRAY item_record.tags
                    LOOP
                        IF trim(tag_name) = '' THEN
                            CONTINUE;
                        END IF;
                        
                        INSERT INTO tags (museum_id, name)
                        VALUES (item_record.museum_id, trim(tag_name))
                        ON CONFLICT (museum_id, name) DO NOTHING;
                        
                        SELECT id INTO tag_id 
                        FROM tags 
                        WHERE museum_id = item_record.museum_id 
                        AND name = trim(tag_name);
                        
                        INSERT INTO item_tags (item_id, tag_id, museum_id)
                        VALUES (item_record.id, tag_id, item_record.museum_id)
                        ON CONFLICT DO NOTHING;
                    END LOOP;
                END LOOP;
                
                RAISE NOTICE 'Tags migration completed successfully';
            END;
        ELSE
            RAISE NOTICE 'All tags already migrated or no tags found';
        END IF;
    END
    \$\$;
    "
    
    echo "✅ Tag conversion completed!"
    echo ""
    echo "📊 Summary of converted tags:"
    
    # Show the new tag entities
    supabase db execute --query "
    SELECT 
        t.name, 
        t.color,
        COUNT(it.item_id) as item_count
    FROM tags t
    LEFT JOIN item_tags it ON t.id = it.tag_id
    GROUP BY t.id, t.name, t.color
    ORDER BY item_count DESC, t.name;
    " --format table
    
    echo ""
    echo "🎯 Next steps:"
    echo "1. Test the new tagging system in your frontend"
    echo "2. Verify items display their tags correctly"  
    echo "3. Create some new tags via the admin interface"
    echo "4. Once confirmed working, the old 'tags' column will be fully removed"
    
else
    echo "❌ Migration cancelled"
    exit 1
fi

echo ""
echo "🚀 Done! Your MCurio system now has proper tag entity relationships."