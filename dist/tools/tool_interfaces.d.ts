export interface execute_command {
    command: string;
    requires_approval: boolean;
}
export interface read_file {
    path: string;
}
export interface write_to_file {
    path: string;
    content: string;
}
export interface replace_in_file {
    path: string;
    diff: string;
}
export interface list_files {
    path: string;
    recursive?: boolean;
}
export interface search_files {
    path: string;
    regex: string;
    file_pattern?: string;
}
export interface browser_action {
    action: "launch" | "click" | "type" | "scroll_down" | "scroll_up" | "close";
    url?: string;
    coordinate?: string;
    text?: string;
}
export interface web_fetch {
    url: string;
}
export interface use_mcp_tool {
    server_name: string;
    tool_name: string;
    arguments: any;
}
export interface access_mcp_resource {
    server_name: string;
    uri: string;
}
export interface list_code_definition_names {
    path: string;
}
//# sourceMappingURL=tool_interfaces.d.ts.map