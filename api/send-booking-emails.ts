import { nodeHandler } from "../lib/server/node-handler";
import { response } from "../lib/server/http";
// Database-free mode sends notifications only through the validated booking API.
export async function POST(_req: Request) {
  return response({ok:false,error:"This endpoint is no longer available."},410);
}

export default nodeHandler(POST);
