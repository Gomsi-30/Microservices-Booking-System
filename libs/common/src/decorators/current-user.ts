import { ExecutionContext, createParamDecorator } from "@nestjs/common";


function getUser(context:ExecutionContext){
   return context.switchToHttp().getRequest().user;
}
export const CurrentUser = createParamDecorator(
    (data:unknown,context:ExecutionContext) => getUser(context)
)