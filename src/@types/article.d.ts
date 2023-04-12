declare module "article" {
  //文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败，不传为全部,-1为全部
  export type ArticleStatus = 0 | 1 | 2 | 3 | undefined;
  export type CoverType = 0 | 1 | 3;
  export interface Cover {
    //封面类型，0-无封面，1-1张封面图片，3-3张封面,2-2张封面
    type: CoverType;
    images: string[];
  }
  export interface Article {
    // 评论数量
    comment_count: number;
    // 封面
    cover: Cover;
    // 文章id
    id: string;
    // 点赞数
    like_count: number;
    // 发布时间
    pubdate: string;
    // 阅读数
    read_count: number;
    // 文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败
    status: ArticleStatus;
    // 文章标题
    title: string;
    // 频道id
    channel_id: string | undefined;
    // 文章内容
    content: string;
  }
  // 请求文章列表时的请求参数
  export interface requestArticleParams {
    status: ArticleStatus;
    // 	不传为全部
    channel_id: string | undefined;
    // 起始时间
    begin_pubdate: Date | null;
    // 截止时间
    end_pubdate: Date | null;
    // 页码 默认为1页
    page: number;
    // 每页数量 不传为默认10
    per_page: number;
  }
  export type PublishArticleParams = Pick<
    Article,
    "channel_id" | "content" | "cover" | "title"
  >;
  export type ArticleDetail = Pick<
    Article,
    "channel_id" | "content" | "cover" | "title" | "id"
  >;
}
