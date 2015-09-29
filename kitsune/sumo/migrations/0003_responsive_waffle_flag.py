# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def create_waffle_flag(apps, schema_editor):
    Flag = apps.get_model('waffle', 'Flag')
    f = Flag(name='responsive', everyone=False, superusers=False, staff=False,
             authenticated=False, rollout=False, testing=False)
    f.save()


def delete_waffle_flag(apps, schema_editor):
    Flag = apps.get_model('waffle', 'Flag')
    f = Flag.objects.get(name='responsive')
    f.delete()


class Migration(migrations.Migration):

    dependencies = [
        ('waffle', '0001_initial'),
        ('sumo', '0002_initial_data'),
    ]

    operations = [
        migrations.RunPython(create_waffle_flag, delete_waffle_flag),
    ]
