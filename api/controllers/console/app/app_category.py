from flask_login import current_user  # type: ignore
from flask_restful import Resource, inputs, marshal, marshal_with, reqparse  # type: ignore
import flask

from controllers.console import api
from controllers.console.wraps import (
    account_initialization_required,
    enterprise_license_required,
    setup_required,
)
from fields.app_category_fields import app_category_fields, app_category_pagination_fields
from libs.login import login_required
from models.common_result import ApiResponse
from models.model import AppCategory

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

    @setup_required
    @login_required
    @account_initialization_required
    # @marshal_with(app_category_fields)
    # @cloud_edition_billing_resource_check("apps")
    def post(self):
        """Create app"""
        title = "创建应用分类"
        api_response = ApiResponse(500, "请求出错")

        try:
            parser = reqparse.RequestParser()
            parser.add_argument("category_name", type=str, required=True, location="json")
            # parser.add_argument("description", type=str, location="json")
            # parser.add_argument("mode", type=str, choices=ALLOW_CREATE_APP_MODES, location="json")
            # parser.add_argument("icon_type", type=str, location="json")
            # parser.add_argument("icon", type=str, location="json")
            # parser.add_argument("icon_background", type=str, location="json")
            args = parser.parse_args()
            app_category_service = AppCategoryService()
            app_category_entity = app_category_service.create_app_category(args)
            if app_category_entity:
                category_result = marshal(app_category_entity, app_category_fields)
                api_response.set_success(f"{title}成功", data=category_result)
            else:
                api_response.set_success(f"{title}失败")
        except Exception as e:
            print(title, e)
            api_response.set_error(f"{title}失败,{e.__str__()}")
        return api_response.__dict__

    @setup_required
    @login_required
    @account_initialization_required
    # @marshal_with(app_category_fields)
    # @cloud_edition_billing_resource_check("apps")
    def put(self):
        """修改应用分类"""
        title = "修改应用分类"
        api_response = ApiResponse(500, "请求出错")

        try:

            input_json = flask.request.get_json()
            print(input_json)
            if input_json is None or len(input_json) <= 0:
                api_response.set_error("请输入参数")
                return api_response.__dict__

            parser = reqparse.RequestParser()
            parser.add_argument("id", type=str, required=True, location="json")
            parser.add_argument("categoryName", type=str, required=True, location="json")
            # parser.add_argument("description", type=str, location="json")
            # parser.add_argument("mode", type=str, choices=ALLOW_CREATE_APP_MODES, location="json")
            # parser.add_argument("icon_type", type=str, location="json")
            # parser.add_argument("icon", type=str, location="json")
            # parser.add_argument("icon_background", type=str, location="json")
            args = parser.parse_args()
            id = args["id"]
            category_name = args["categoryName"]
            if not id:
                api_response.set_error(f"{title}失败,请输入id")
                return api_response.__dict__
            if not category_name:
                api_response.set_error(f"{title}失败,请输入应用分类")
                return api_response.__dict__

            app_category = AppCategory()
            app_category.id = id
            app_category.name = category_name

            app_category_service = AppCategoryService()
            app_category_entity = app_category_service.update_app_category(app_category)
            if app_category_entity:
                category_result = marshal(app_category_entity, app_category_fields)
                api_response.set_success(f"{title}成功", data=category_result)
            else:
                api_response.set_success(f"{title}失败")
        except Exception as e:
            print(title, e)
            api_response.set_error(f"{title}失败,{e.__str__()}")
        return api_response.__dict__


class AppCategoryListPageApi(Resource):
    @setup_required
    @login_required
    @account_initialization_required
    @enterprise_license_required
    def get(self):
        """Get app_category list"""

        title = "获取应用分类列表分页"
        api_response = ApiResponse(500, "请求出错")
        parser = reqparse.RequestParser()
        parser.add_argument("page", type=inputs.int_range(1, 99999), required=False, default=1, location="args")
        parser.add_argument("limit", type=inputs.int_range(1, 100), required=False, default=20, location="args")
        parser.add_argument("name", type=str, required=False, location="args")
        args = parser.parse_args()

        try:
            app_category_service = AppCategoryService()
            category_list_page = app_category_service.get_app_category_list_page(args)
            if not category_list_page:
                return {"data": [], "total": 0, "page": 1, "limit": 20, "has_more": False}
            api_response.set_success(f"{title}成功", data=category_list_page)
            if category_list_page:
                category_list = marshal(category_list_page, app_category_pagination_fields)
                api_response.set_success(f"{title}成功", data=category_list)
            else:
                api_response.set_success(f"{title}成功,未取到数据")
        except Exception as e:
            print(title, e)
            api_response.set_error(f"{title}失败,{e.__str__()}")
        return api_response.__dict__


class AppCategoryApi(Resource):
    @setup_required
    @login_required
    @account_initialization_required
    def delete(self, app_category_id):
        title = "删除应用分类"
        api_response = ApiResponse(500, "请求出错")
        try:

            app_category_service = AppCategoryService()
            result = app_category_service.del_app_category(app_category_id)
            if result and result.rowcount > 0:
                api_response.set_success(f"{title}成功")
            # api_response.set_success(f"{title}成功")

        except Exception as e:
            print(title, e)
            api_response.set_error(f"{title}失败,{e.__str__()}")

        return api_response.__dict__


api.add_resource(AppCategoryListApi, "/app_category")
api.add_resource(AppCategoryListPageApi, "/app_category_list_page")
api.add_resource(AppCategoryApi, "/app_category_api/<uuid:app_category_id>")
# api.add_resource(AppApi, "/apps/<uuid:app_id>")
# api.add_resource(AppCopyApi, "/apps/<uuid:app_id>/copy")
# api.add_resource(AppExportApi, "/apps/<uuid:app_id>/export")
# api.add_resource(AppNameApi, "/apps/<uuid:app_id>/name")
# api.add_resource(AppIconApi, "/apps/<uuid:app_id>/icon")
# api.add_resource(AppSiteStatus, "/apps/<uuid:app_id>/site-enable")
# api.add_resource(AppApiStatus, "/apps/<uuid:app_id>/api-enable")
# api.add_resource(AppTraceApi, "/apps/<uuid:app_id>/trace")
