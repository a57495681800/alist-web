import axios, { CancelToken } from "axios"
import {
  PEmptyResp,
  FsGetResp,
  FsListResp,
  Obj,
  PResp,
  FsSearchResp,
  RenameObj,
} from "~/types"
import { r } from "."

export const fsGet = (
  path: string = "/",
  password = "",
): Promise<FsGetResp> => {
  return r.post("/fs/get", {
    path: path,
    password: password,
  })
}
export const fsList = (
  path: string = "/",
  password = "",
  page = 1,
  per_page = 0,
  refresh = false,
  cancelToken?: CancelToken,
): Promise<FsListResp> => {
  return r.post(
    "/fs/list",
    {
      path,
      password,
      page,
      per_page,
      refresh,
    },
    {
      cancelToken: cancelToken,
    },
  )
}

export const fsDirs = (
  path = "/",
  password = "",
  forceRoot = false,
): PResp<Obj[]> => {
  return r.post("/fs/dirs", { path, password, force_root: forceRoot })
}

export const fsMkdir = (path: string): PEmptyResp => {
  return r.post("/fs/mkdir", { path })
}

export const fsRename = (path: string, name: string): PEmptyResp => {
  return r.post("/fs/rename", { path, name })
}

export const fsBatchRename = (
  src_dir: string,
  rename_objects: RenameObj[],
): PEmptyResp => {
  return r.post("/fs/batch_rename", { src_dir, rename_objects })
}

export const fsMove = (
  src_dir: string,
  dst_dir: string,
  names: string[],
): PEmptyResp => {
  return r.post("/fs/move", { src_dir, dst_dir, names })
}

export const fsRecursiveMove = (
  src_dir: string,
  dst_dir: string,
): PEmptyResp => {
  return r.post("/fs/recursive_move", { src_dir, dst_dir })
}

export const fsCopy = (
  src_dir: string,
  dst_dir: string,
  names: string[],
): PEmptyResp => {
  return r.post("/fs/copy", { src_dir, dst_dir, names })
}

export const fsRemove = (dir: string, names: string[]): PEmptyResp => {
  return r.post("/fs/remove", { dir, names })
}

export const fsRemoveEmptyDirectory = (src_dir: string): PEmptyResp => {
  return r.post("/fs/remove_empty_directory", { src_dir })
}

export const fsNewFile = (path: string, password: string): PEmptyResp => {
  return r.put("/fs/put", undefined, {
    headers: {
      "File-Path": encodeURIComponent(path),
      Password: password,
    },
  })
}

export const offlineDownload = (
  path: string,
  urls: string[],
  type: string,
): PEmptyResp => {
  return r.post(`/fs/add_${type}`, { path, urls })
}

export const helper = async (url: string) =>{
  try {
    const resp = await axios.get(url, {
      responseType: 'arraybuffer', // 使用 arraybuffer 获取二进制数据
    })

    const gb2312ContentBuffer = resp.data
    const gb2312Decoder = new TextDecoder('gb2312') // 创建 GB2312 编码的 TextDecoder 实例

    const gb2312Text = gb2312Decoder.decode(gb2312ContentBuffer) // 解码为 GB2312 编码的文本
    return gb2312Text // 返回 GB2312 编码的文本

  } catch (e) {
    console.error(e)
    return ''
  }
}

export const fetchText = async (
  url: string,
  ts = true,
  flag: boolean,
): Promise<{
  content: string
  contentType?: string
}> => {
  try {
    const resp = await axios.get(url, {
      responseType: "blob",
      params: ts
        ? {
          ts: new Date().getTime(),
        }
        : undefined,
    })
    let content
    if (flag) {
      content = await helper(url)
    } else {
      content = await resp.data.text()
    }
    const contentType = resp.headers["content-type"]
    return { content, contentType }
  } catch (e) {
    return ts
      ? await fetchText(url, false, flag)
      : {
        content: `Failed to fetch ${url}: ${e}`,
        contentType: "",
      }
  }
}

export const fsSearch = async (
  parent: string,
  keywords: string,
  password = "",
  scope = 0,
  page = 1,
  per_page = 100,
): Promise<FsSearchResp> => {
  return r.post("/fs/search", {
    parent,
    keywords,
    scope,
    page,
    per_page,
    password,
  })
}

export const buildIndex = async (paths = ["/"], max_depth = -1): PEmptyResp => {
  return r.post("/admin/index/build", {
    paths,
    max_depth,
  })
}

export const updateIndex = async (paths = [], max_depth = -1): PEmptyResp => {
  return r.post("/admin/index/update", {
    paths,
    max_depth,
  })
}
