import { execute_command as ExecuteCommandArgs, read_file as ReadFileArgs, write_to_file as WriteToFileArgs, replace_in_file as ReplaceInFileArgs, list_files as ListFilesArgs, search_files as SearchFilesArgs, browser_action as BrowserActionArgs, web_fetch as WebFetchArgs, use_mcp_tool as UseMcpToolArgs, access_mcp_resource as AccessMcpResourceArgs, list_code_definition_names as ListCodeDefinitionNamesArgs } from "./tool_interfaces.ts";

declare function execute_command(command: ExecuteCommandArgs['command'], requires_approval: ExecuteCommandArgs['requires_approval']): Promise<any>;
declare function read_file(path: ReadFileArgs['path']): Promise<any>;
declare function write_to_file(path: WriteToFileArgs['path'], content: WriteToFileArgs['content']): Promise<any>;
declare function replace_in_file(path: ReplaceInFileArgs['path'], diff: ReplaceInFileArgs['diff']): Promise<any>;
declare function list_files(path: ListFilesArgs['path'], recursive?: ListFilesArgs['recursive']): Promise<any>;
declare function search_files(path: SearchFilesArgs['path'], regex: SearchFilesArgs['regex'], file_pattern?: SearchFilesArgs['file_pattern']): Promise<any>;
declare function browser_action(action: BrowserActionArgs['action'], url?: BrowserActionArgs['url'], coordinate?: BrowserActionArgs['coordinate'], text?: BrowserActionArgs['text']): Promise<any>;
declare function web_fetch(url: WebFetchArgs['url']): Promise<any>;
declare function use_mcp_tool(server_name: UseMcpToolArgs['server_name'], tool_name: UseMcpToolArgs['tool_name'], arguments: UseMcpToolArgs['arguments']): Promise<any>;
declare function access_mcp_resource(server_name: AccessMcpResourceArgs['server_name'], uri: AccessMcpResourceArgs['uri']): Promise<any>;
declare function list_code_definition_names(path: ListCodeDefinitionNamesArgs['path']): Promise<any>;

export {
  execute_command,
  read_file,
  write_to_file,
  replace_in_file,
  list_files,
  search_files,
  browser_action,
  web_fetch,
  use_mcp_tool,
  access_mcp_resource,
  list_code_definition_names
};
