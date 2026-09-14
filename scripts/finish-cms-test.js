const fs=require('fs');
function edit(file,fn){const before=fs.readFileSync(file,'utf8');const after=fn(before);if(after!==before){fs.writeFileSync(file,after);console.log('Updated '+file);}else console.log('No change '+file);}

edit('scripts/build-articles.js',s=>s.replace('href="${story.href}"','href="../${story.href}"'));

edit('.pages.yml',s=>{
 if(s.includes('name: home-content')) return s;
 const marker='      - name: hunting-content\n';
 const block=`      - name: home-content
        label: Home Page Content
        type: file
        path: content/pages/home.yml
        fields:
          - { name: hero_eyebrow, label: Hero Small Heading, type: string }
          - { name: hero_title, label: Hero Main Heading, type: string }
          - { name: hero_text, label: Hero Description, type: text }
          - { name: hero_button1_label, label: Hero Button 1 Text, type: string }
          - { name: hero_button1_url, label: Hero Button 1 Address, type: string }
          - { name: hero_button2_label, label: Hero Button 2 Text, type: string }
          - { name: hero_button2_url, label: Hero Button 2 Address, type: string }
          - { name: editorial_title, label: Editorial Heading, type: string }
          - { name: editorial_text, label: Editorial Text, type: text }
          - { name: stat1_title, label: Highlight 1 Heading, type: string }
          - { name: stat1_text, label: Highlight 1 Text, type: string }
          - { name: stat2_title, label: Highlight 2 Heading, type: string }
          - { name: stat2_text, label: Highlight 2 Text, type: string }
          - { name: stat3_title, label: Highlight 3 Heading, type: string }
          - { name: stat3_text, label: Highlight 3 Text, type: string }
          - { name: fieldcraft_image, label: Fieldcraft Photo, type: image }
          - { name: fieldcraft_eyebrow, label: Fieldcraft Small Heading, type: string }
          - { name: fieldcraft_title, label: Fieldcraft Heading, type: string }
          - { name: fieldcraft_text, label: Fieldcraft Description, type: text }
          - { name: fieldcraft_button, label: Fieldcraft Button, type: string }
          - { name: fieldcraft_url, label: Fieldcraft Link, type: string }
          - { name: guides_eyebrow, label: Featured Guides Small Heading, type: string }
          - { name: guides_title, label: Featured Guides Heading, type: string }
          - { name: guide1_image, label: Featured Guide 1 Photo, type: image }
          - { name: guide1_tag, label: Featured Guide 1 Tag, type: string }
          - { name: guide1_title, label: Featured Guide 1 Title, type: string }
          - { name: guide1_url, label: Featured Guide 1 Link, type: string }
          - { name: guide2_image, label: Featured Guide 2 Photo, type: image }
          - { name: guide2_tag, label: Featured Guide 2 Tag, type: string }
          - { name: guide2_title, label: Featured Guide 2 Title, type: string }
          - { name: guide2_url, label: Featured Guide 2 Link, type: string }
          - { name: guide3_image, label: Featured Guide 3 Photo, type: image }
          - { name: guide3_tag, label: Featured Guide 3 Tag, type: string }
          - { name: guide3_title, label: Featured Guide 3 Title, type: string }
          - { name: guide3_url, label: Featured Guide 3 Link, type: string }
          - { name: family_image, label: Family Section Photo, type: image }
          - { name: family_eyebrow, label: Family Small Heading, type: string }
          - { name: family_title, label: Family Heading, type: string }
          - { name: family_text, label: Family Text, type: text }
          - { name: family_button, label: Family Button, type: string }
          - { name: family_url, label: Family Link, type: string }
          - { name: gallery_eyebrow, label: Gallery Small Heading, type: string }
          - { name: gallery_title, label: Gallery Heading, type: string }
          - { name: gallery1_image, label: Gallery Photo 1, type: image }
          - { name: gallery1_caption, label: Gallery Caption 1, type: string }
          - { name: gallery2_image, label: Gallery Photo 2, type: image }
          - { name: gallery2_caption, label: Gallery Caption 2, type: string }
          - { name: gallery3_image, label: Gallery Photo 3, type: image }
          - { name: gallery3_caption, label: Gallery Caption 3, type: string }
          - { name: gallery4_image, label: Gallery Photo 4, type: image }
          - { name: gallery4_caption, label: Gallery Caption 4, type: string }
          - { name: gallery5_image, label: Gallery Photo 5, type: image }
          - { name: gallery5_caption, label: Gallery Caption 5, type: string }
          - { name: newsletter_eyebrow, label: Newsletter Small Heading, type: string }
          - { name: newsletter_title, label: Newsletter Heading, type: string }
          - { name: newsletter_text, label: Newsletter Text, type: text }
          - { name: newsletter_button, label: Newsletter Button, type: string }

`;
 if(!s.includes(marker)) throw new Error('CMS insertion marker missing');
 return s.replace(marker,block+marker);
});

edit('.pages.yml',s=>{
 if(s.includes('name: guides-content')) return s;
 const marker='  - name: articles\n';
 const block=`      - name: guides-content
        label: Field Guides Page Content
        type: file
        path: content/pages/guides.yml
        fields:
          - { name: hero_eyebrow, label: Hero Small Heading, type: string }
          - { name: hero_title, label: Hero Main Heading, type: string }
          - { name: hero_text, label: Hero Description, type: text }
          - { name: card1_tag, label: Card 1 Tag, type: string }
          - { name: card1_title, label: Card 1 Title, type: string }
          - { name: card1_link, label: Card 1 Link Text, type: string }
          - { name: card1_url, label: Card 1 Link Address, type: string }
          - { name: card2_tag, label: Card 2 Tag, type: string }
          - { name: card2_title, label: Card 2 Title, type: string }
          - { name: card2_link, label: Card 2 Link Text, type: string }
          - { name: card2_url, label: Card 2 Link Address, type: string }
          - { name: card3_tag, label: Card 3 Tag, type: string }
          - { name: card3_title, label: Card 3 Title, type: string }
          - { name: card3_link, label: Card 3 Link Text, type: string }
          - { name: card3_url, label: Card 3 Link Address, type: string }
          - { name: card4_tag, label: Card 4 Tag, type: string }
          - { name: card4_title, label: Card 4 Title, type: string }
          - { name: card4_link, label: Card 4 Link Text, type: string }
          - { name: card4_url, label: Card 4 Link Address, type: string }
          - { name: card5_tag, label: Card 5 Tag, type: string }
          - { name: card5_title, label: Card 5 Title, type: string }
          - { name: card5_link, label: Card 5 Link Text, type: string }
          - { name: card5_url, label: Card 5 Link Address, type: string }
          - { name: card6_tag, label: Card 6 Tag, type: string }
          - { name: card6_title, label: Card 6 Title, type: string }
          - { name: card6_link, label: Card 6 Link Text, type: string }
          - { name: card6_url, label: Card 6 Link Address, type: string }

      - name: about-content
        label: About Page Content
        type: file
        path: content/pages/about.yml
        fields:
          - { name: hero_eyebrow, label: Hero Small Heading, type: string }
          - { name: hero_title, label: Hero Main Heading, type: string }
          - { name: hero_text, label: Hero Description, type: text }
          - { name: idea_title, label: Idea Heading, type: string }
          - { name: idea_text, label: Idea Text, type: text }
          - { name: find_title, label: What You Will Find Heading, type: string }
          - { name: find_text, label: What You Will Find Text, type: text }
          - { name: principle_text, label: Editorial Principle, type: text }
          - { name: family_image, label: Story Photo, type: image }
          - { name: family_eyebrow, label: Story Small Heading, type: string }
          - { name: family_title, label: Story Heading, type: string }
          - { name: family_text1, label: Story Paragraph 1, type: text }
          - { name: family_text2, label: Story Paragraph 2, type: text }
          - { name: values_eyebrow, label: Values Small Heading, type: string }
          - { name: values_title, label: Values Heading, type: string }
          - { name: value1_tag, label: Value 1 Tag, type: string }
          - { name: value1_title, label: Value 1 Heading, type: string }
          - { name: value1_text, label: Value 1 Text, type: text }
          - { name: value2_tag, label: Value 2 Tag, type: string }
          - { name: value2_title, label: Value 2 Heading, type: string }
          - { name: value2_text, label: Value 2 Text, type: text }
          - { name: value3_tag, label: Value 3 Tag, type: string }
          - { name: value3_title, label: Value 3 Heading, type: string }
          - { name: value3_text, label: Value 3 Text, type: text }

      - name: contact-content
        label: Contact Page Content
        type: file
        path: content/pages/contact.yml
        fields:
          - { name: hero_eyebrow, label: Hero Small Heading, type: string }
          - { name: hero_title, label: Hero Main Heading, type: string }
          - { name: hero_text, label: Hero Description, type: text }
          - { name: section_title, label: Contact Heading, type: string }
          - { name: section_text, label: Contact Text, type: text }
          - { name: email_label, label: Email Label, type: string }
          - { name: email, label: Email Address, type: string }

      - name: privacy-content
        label: Privacy Page Content
        type: file
        path: content/pages/privacy.yml
        fields:
          - { name: hero_eyebrow, label: Hero Small Heading, type: string }
          - { name: hero_title, label: Hero Main Heading, type: string }
          - { name: hero_text, label: Hero Description, type: text }
          - { name: updated_label, label: Updated Date, type: string }
          - { name: body, label: Privacy Policy, type: rich-text, options: { format: html } }

`;
 if(!s.includes(marker)) throw new Error('Articles marker missing');
 return s.replace(marker,block+marker);
});
