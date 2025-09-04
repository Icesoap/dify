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


app_category_pagination_fields = {
    "page": fields.Integer,
    "limit": fields.Integer(attribute="per_page"),
    "total": fields.Integer,
    "has_more": fields.Boolean(attribute="has_next"),
    "data": fields.List(fields.Nested(app_category_fields), attribute="items"),
}

