from configs import dify_config
from dify_app import DifyApp


def init_app(app: DifyApp):
    # register blueprint routers

    from flask_cors import CORS  # type: ignore

    from controllers.console import bp as console_app_bp
    from controllers.files import bp as files_bp
    from controllers.inner_api import bp as inner_api_bp
    from controllers.mcp import bp as mcp_bp
    from controllers.service_api import bp as service_api_bp
    from controllers.web import bp as web_bp

    CORS(
        service_api_bp,
        # allow_headers=["Content-Type", "Authorization", "X-App-Code"],
        # yq修改 20260127 解决王恒跨域问题
        allow_headers=["Content-Type", "Authorization", "X-App-Code", "Api-Version", "Loginuserid"],
        methods=["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
        # # yq修改 20260127 解决王恒跨域问题
        expose_headers=["X-Version", "X-Env", "api-version", "Loginuserid"],
        resources={r"/*": {"origins": dify_config.WEB_API_CORS_ALLOW_ORIGINS}},
    )
    app.register_blueprint(service_api_bp)

    CORS(
        web_bp,
        resources={r"/*": {"origins": dify_config.WEB_API_CORS_ALLOW_ORIGINS}},
        supports_credentials=True,
        # allow_headers=["Content-Type", "Authorization", "X-App-Code"],
        # yq修改 20260127 解决王恒跨域问题,这里需要加入 "Api-Version", "Loginuserid" 可能是因为PLM那边默认带了这两个头
        allow_headers=["Content-Type", "Authorization", "X-App-Code", "Api-Version", "Loginuserid"],
        methods=["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
        # yq修改 20260127 解决王恒跨域问题
        expose_headers=["X-Version", "X-Env", "Api-Version", "Loginuserid"],
        # expose_headers=["X-Version", "X-Env"],
    )

    app.register_blueprint(web_bp)

    CORS(
        console_app_bp,
        resources={r"/*": {"origins": dify_config.CONSOLE_CORS_ALLOW_ORIGINS}},
        supports_credentials=True,
        # allow_headers=["Content-Type", "Authorization", "X-App-Code"],
        allow_headers=["Content-Type", "Authorization", "X-App-Code", "Api-Version", "Loginuserid"],
        methods=["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
        # expose_headers=["X-Version", "X-Env"],
        expose_headers=["X-Version", "X-Env", "Api-Version", "Loginuserid"],
    )

    app.register_blueprint(console_app_bp)

    CORS(files_bp, allow_headers=["Content-Type"], methods=["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"])
    app.register_blueprint(files_bp)

    app.register_blueprint(inner_api_bp)
    app.register_blueprint(mcp_bp)
