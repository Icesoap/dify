from flask_restful import fields  # type: ignore

from libs.helper import TimestampField

app_category_fields = {
    "id": fields.String,
    "name": fields.String,
    "created_by": fields.String,
    "created_at": fields.DateTime(dt_format="iso8601"),
    "updated_by": fields.String,
    "updated_at": fields.DateTime(dt_format="iso8601")
    # 'account': fields.Nested(simple_account_fields, allow_null=True)
}


