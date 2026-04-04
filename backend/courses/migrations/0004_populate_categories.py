from django.db import migrations

def populate_categories(apps, schema_editor):
    Category = apps.get_model('courses', 'Category')
    categories = [
        'Programming',
        'Data Science',
        'Design',
        'Marketing',
        'Business',
        'Personal Development',
        'Health & Fitness',
        'Language Learning',
        'Engineering',
        'Cybersecurity',
        'Finance',
        'AI & Machine Learning'
    ]
    for cat_name in categories:
        Category.objects.get_or_create(name=cat_name)

def remove_categories(apps, schema_editor):
    Category = apps.get_model('courses', 'Category')
    Category.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0003_enrollment_country_code_enrollment_device_type_and_more'),
    ]

    operations = [
        migrations.RunPython(
            populate_categories, 
            # remove_categories
        ),
    ]
