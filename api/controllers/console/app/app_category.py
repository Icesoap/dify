from flask_login import current_user  # type: ignore
from flask_restful import Resource, inputs, marshal, marshal_with, reqparse  # type: ignore

from controllers.console import api
from controllers.console.wraps import (
    account_initialization_required,
    enterprise_license_required,
    setup_required,
)
from fields.app_category_fields import app_category_fields
from libs.login import login_required
from models.common_result import ApiResponse

from services.app_category_service import AppCategoryService

ALLOW_CREATE_APP_MODES = ["chat", "agent-chat", "advanced-chat", "workflow", "completion"]


class AppCategoryListApi(Resource):
    @setup_required
    @login_required
    @account_initialization_required
    @enterprise_license_required
    def get(self):
        """Get app_category list"""

        title = "获取应用分类列表"
        api_response = ApiResponse(500, "请求出错")

        try:
            app_category_service = AppCategoryService()
            category_list = app_category_service.get_app_category_list()
            if category_list:
                category_list = marshal(category_list, app_category_fields)
                api_response.set_success(f"{title}成功", data=category_list)
            else:
                api_response.set_success(f"{title}成功,未取到数据")
        except Exception as e:
            print(title, e)
            api_response.set_error(f"{title}失败,{e.__str__()}")
        return api_response.__dict__

    # @setup_required
    # @login_required
    # @account_initialization_required
    # @marshal_with(app_detail_fields)
    # @cloud_edition_billing_resource_check("apps")
    # def post(self):
    #     """Create app"""
    #     parser = reqparse.RequestParser()
    #     parser.add_argument("name", type=str, required=True, location="json")
    #     parser.add_argument("description", type=str, location="json")
    #     parser.add_argument("mode", type=str, choices=ALLOW_CREATE_APP_MODES, location="json")
    #     parser.add_argument("icon_type", type=str, location="json")
    #     parser.add_argument("icon", type=str, location="json")
    #     parser.add_argument("icon_background", type=str, location="json")
    #     args = parser.parse_args()
    #
    #     # The role of the current user in the ta table must be admin, owner, or editor
    #     if not current_user.is_editor:
    #         raise Forbidden()
    #
    #     if "mode" not in args or args["mode"] is None:
    #         raise BadRequest("mode is required")
    #
    #     app_service = AppService()
    #     app = app_service.create_app(current_user.current_tenant_id, args, current_user)
    #
    #     return app, 201


api.add_resource(AppCategoryListApi, "/app_category")
# api.add_resource(AppApi, "/apps/<uuid:app_id>")
# api.add_resource(AppCopyApi, "/apps/<uuid:app_id>/copy")
# api.add_resource(AppExportApi, "/apps/<uuid:app_id>/export")
# api.add_resource(AppNameApi, "/apps/<uuid:app_id>/name")
# api.add_resource(AppIconApi, "/apps/<uuid:app_id>/icon")
# api.add_resource(AppSiteStatus, "/apps/<uuid:app_id>/site-enable")
# api.add_resource(AppApiStatus, "/apps/<uuid:app_id>/api-enable")
# api.add_resource(AppTraceApi, "/apps/<uuid:app_id>/trace")
