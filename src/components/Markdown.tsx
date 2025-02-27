// @ts-ignore
import { hljs } from "./highlight.js"
import SolidMarkdown from "solid-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import reMarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "./markdown.css"
import "./katex.css"
import {
  Show,
  createEffect,
  createMemo,
  createSignal,
  on,
  onMount,
} from "solid-js"
import { clsx } from "clsx"
import { Box } from "@hope-ui/solid"
import { useParseText } from "~/hooks"
import { EncodingSelect } from "."

export const Markdown = (props: {
  children?: string | ArrayBuffer
  class?: string
  ext?: string
}) => {
  onMount(() => {
    hljs.highlightAll()
    window.onMDRender && window.onMDRender()
  })
  const [encoding, setEncoding] = createSignal<string>("utf-8")
  const [show, setShow] = createSignal(true)
  const { isString, text } = useParseText(props.children)
  const convertToMd = (content: string) => {
    if (!props.ext || props.ext === "md") {
      return "```" + props.ext + "\n" + content + "\n```"
    }
    return content
  }
  const md = createMemo(() => convertToMd(text(encoding())))
  createEffect(
    on(md, () => {
      setShow(false)
      setTimeout(() => {
        setShow(true)
      })
    }),
  )
  return (
    <Box class="markdown" pos="relative" w="$full">
      <Show when={show()}>
        <SolidMarkdown
          class={clsx("markdown-body", props.class)}
          remarkPlugins={[remarkGfm, reMarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          children={md()}
        />
      </Show>
      <Show when={!isString}>
        <EncodingSelect encoding={encoding()} setEncoding={setEncoding} />
      </Show>
    </Box>
  )
}
