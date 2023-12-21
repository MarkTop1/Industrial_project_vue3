// mock/article.bundled_pqo2j3c0mrg.mjs
var article_list = [];
var count = 100;
for (let i = 0; i < count; i++) {
  article_list.push({
    id: i,
    timestamp: (/* @__PURE__ */ new Date()).getTime(),
    author: `Author ${i}`,
    reviewer: `reviewer ${i}`,
    title: `Title ${i}`,
    importance: Math.floor(Math.random() * 3) + 1,
    type: ["CN", "US", "JP", "EU"][Math.floor(Math.random() * 4)],
    status: ["published", "draft"][Math.floor(Math.random() * 2)],
    display_time: (/* @__PURE__ */ new Date()).toISOString(),
    pageviews: Math.floor(Math.random() * (5e3 - 300)) + 300,
    remark: `remark ${i}`
  });
}
var article_default = [
  {
    url: "/api/v1/article/list",
    timeout: 200,
    method: "get",
    response: ({ query }) => {
      const { importance, type, title, page = 1, limit = 10, sort } = query;
      let mock_list = article_list.filter((item) => {
        if (importance && item.importance !== +importance)
          return false;
        if (type && item.type !== type)
          return false;
        if (title && item.title.indexOf(title) < 0)
          return false;
        if (item.status === "deleted")
          return false;
        return true;
      });
      if (sort === "-id") {
        mock_list = mock_list.reverse();
      }
      const page_list = mock_list.filter(
        (item, index) => index < limit * page && index >= limit * (page - 1)
      );
      return {
        code: "00000",
        data: { total: mock_list.length, page, items: page_list },
        msg: "\u4E00\u5207ok"
      };
    }
  },
  {
    url: "/api/v1/article/detail",
    timeout: 200,
    method: "get",
    response: ({ query }) => {
      const { id } = query;
      for (const article of article_list) {
        if (article.id === +id) {
          return {
            code: "00000",
            data: article,
            msg: "\u4E00\u5207ok"
          };
        }
      }
    }
  },
  {
    url: "/api/v1/article/pv",
    timeout: 200,
    method: "get",
    response: ({ query }) => {
      const { id } = query;
      for (const article of article_list) {
        if (article.id === +id) {
          return {
            code: "00000",
            data: {
              pv: article.pageviews,
              pvData: [
                { key: "PC", pv: 1024 },
                { key: "mobile", pv: 1024 },
                { key: "ios", pv: 1024 },
                { key: "android", pv: 1024 }
              ]
            },
            msg: "\u4E00\u5207ok"
          };
        }
      }
    }
  },
  {
    url: "/api/v1/article/update",
    timeout: 200,
    method: "post",
    response: ({ body }) => {
      const { id, ...updatedFields } = body;
      const articleToUpdate = article_list.find(
        (article) => article.id === id
      );
      if (articleToUpdate) {
        Object.assign(articleToUpdate, updatedFields);
        return {
          code: "00000",
          data: {
            article: articleToUpdate
          },
          msg: "\u4E00\u5207ok"
        };
      } else {
        console.error(`Article with id ${id} not found.`);
      }
    }
  },
  {
    url: "/api/v1/article/create",
    timeout: 200,
    method: "post",
    response: ({ body }) => {
      const { title, author, importance, type, status, remark, timestamp } = body;
      const maxId = article_list.reduce((maxId2, article2) => {
        return Math.max(maxId2, article2.id);
      }, -1);
      const article = {
        id: maxId + 1,
        timestamp,
        author,
        reviewer: `reviewer ${maxId + 1}`,
        title,
        importance,
        type,
        status,
        display_time: new Date(timestamp).toISOString(),
        pageviews: Math.floor(Math.random() * (5e3 - 300)) + 300,
        remark
      };
      article_list.push(article);
      return {
        code: "00000",
        data: {
          article
        },
        msg: "\u4E00\u5207ok"
      };
    }
  },
  {
    url: "/api/v1/article/delete",
    timeout: 200,
    method: "post",
    response: ({ body }) => {
      const { id } = body;
      const index = article_list.findIndex((article) => article.id === id);
      article_list.splice(index, 1);
      return {
        code: "00000",
        msg: "\u4E00\u5207ok"
      };
    }
  }
];
export {
  article_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibW9jay9tb2NrL2FydGljbGUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiSTpcXFxcMjAyNFNjaG9vbFxcXFxTY2hvb2xXT1JLXFxcXEdyb3VwLUktSW5kdXN0cmlhbC1wcm9qZWN0LU5ldy1Ud29cXFxcYWRtaW4tdnVlM1xcXFxtb2NrXFxcXGFydGljbGUudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiSTpcXFxcMjAyNFNjaG9vbFxcXFxTY2hvb2xXT1JLXFxcXEdyb3VwLUktSW5kdXN0cmlhbC1wcm9qZWN0LU5ldy1Ud29cXFxcYWRtaW4tdnVlM1xcXFxtb2NrXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9JOi8yMDI0U2Nob29sL1NjaG9vbFdPUksvR3JvdXAtSS1JbmR1c3RyaWFsLXByb2plY3QtTmV3LVR3by9hZG1pbi12dWUzL21vY2svYXJ0aWNsZS50c1wiO2ltcG9ydCB7IE1vY2tNZXRob2QgfSBmcm9tIFwidml0ZS1wbHVnaW4tbW9ja1wiO1xuXG5jb25zdCBhcnRpY2xlX2xpc3Q6IGFueSA9IFtdO1xuY29uc3QgY291bnQgPSAxMDA7XG5cbmZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICBhcnRpY2xlX2xpc3QucHVzaCh7XG4gICAgaWQ6IGksXG4gICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICBhdXRob3I6IGBBdXRob3IgJHtpfWAsXG4gICAgcmV2aWV3ZXI6IGByZXZpZXdlciAke2l9YCxcbiAgICB0aXRsZTogYFRpdGxlICR7aX1gLFxuICAgIGltcG9ydGFuY2U6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDMpICsgMSxcbiAgICB0eXBlOiBbXCJDTlwiLCBcIlVTXCIsIFwiSlBcIiwgXCJFVVwiXVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0KV0sXG4gICAgc3RhdHVzOiBbXCJwdWJsaXNoZWRcIiwgXCJkcmFmdFwiXVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKV0sXG4gICAgZGlzcGxheV90aW1lOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgcGFnZXZpZXdzOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNTAwMCAtIDMwMCkpICsgMzAwLFxuICAgIHJlbWFyazogYHJlbWFyayAke2l9YCxcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFtcbiAge1xuICAgIHVybDogXCIvYXBpL3YxL2FydGljbGUvbGlzdFwiLFxuICAgIHRpbWVvdXQ6IDIwMCxcbiAgICBtZXRob2Q6IFwiZ2V0XCIsXG4gICAgcmVzcG9uc2U6ICh7IHF1ZXJ5IH0pID0+IHtcbiAgICAgIGNvbnN0IHsgaW1wb3J0YW5jZSwgdHlwZSwgdGl0bGUsIHBhZ2UgPSAxLCBsaW1pdCA9IDEwLCBzb3J0IH0gPSBxdWVyeTtcbiAgICAgIGxldCBtb2NrX2xpc3QgPSBhcnRpY2xlX2xpc3QuZmlsdGVyKChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKGltcG9ydGFuY2UgJiYgaXRlbS5pbXBvcnRhbmNlICE9PSAraW1wb3J0YW5jZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAodHlwZSAmJiBpdGVtLnR5cGUgIT09IHR5cGUpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHRpdGxlICYmIGl0ZW0udGl0bGUuaW5kZXhPZih0aXRsZSkgPCAwKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChpdGVtLnN0YXR1cyA9PT0gXCJkZWxldGVkXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9KTtcbiAgICAgIGlmIChzb3J0ID09PSBcIi1pZFwiKSB7XG4gICAgICAgIG1vY2tfbGlzdCA9IG1vY2tfbGlzdC5yZXZlcnNlKCk7XG4gICAgICB9XG4gICAgICBjb25zdCBwYWdlX2xpc3QgPSBtb2NrX2xpc3QuZmlsdGVyKFxuICAgICAgICAoaXRlbTogYW55LCBpbmRleDogbnVtYmVyKSA9PlxuICAgICAgICAgIGluZGV4IDwgbGltaXQgKiBwYWdlICYmIGluZGV4ID49IGxpbWl0ICogKHBhZ2UgLSAxKVxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogXCIwMDAwMFwiLFxuICAgICAgICBkYXRhOiB7IHRvdGFsOiBtb2NrX2xpc3QubGVuZ3RoLCBwYWdlOiBwYWdlLCBpdGVtczogcGFnZV9saXN0IH0sXG4gICAgICAgIG1zZzogXCJcdTRFMDBcdTUyMDdva1wiLFxuICAgICAgfTtcbiAgICB9LFxuICB9LFxuICB7XG4gICAgdXJsOiBcIi9hcGkvdjEvYXJ0aWNsZS9kZXRhaWxcIixcbiAgICB0aW1lb3V0OiAyMDAsXG4gICAgbWV0aG9kOiBcImdldFwiLFxuICAgIHJlc3BvbnNlOiAoeyBxdWVyeSB9KSA9PiB7XG4gICAgICBjb25zdCB7IGlkIH0gPSBxdWVyeTtcbiAgICAgIGZvciAoY29uc3QgYXJ0aWNsZSBvZiBhcnRpY2xlX2xpc3QpIHtcbiAgICAgICAgaWYgKGFydGljbGUuaWQgPT09ICtpZCkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb2RlOiBcIjAwMDAwXCIsXG4gICAgICAgICAgICBkYXRhOiBhcnRpY2xlLFxuICAgICAgICAgICAgbXNnOiBcIlx1NEUwMFx1NTIwN29rXCIsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gIH0sXG4gIHtcbiAgICB1cmw6IFwiL2FwaS92MS9hcnRpY2xlL3B2XCIsXG4gICAgdGltZW91dDogMjAwLFxuICAgIG1ldGhvZDogXCJnZXRcIixcbiAgICByZXNwb25zZTogKHsgcXVlcnkgfSkgPT4ge1xuICAgICAgY29uc3QgeyBpZCB9ID0gcXVlcnk7XG4gICAgICBmb3IgKGNvbnN0IGFydGljbGUgb2YgYXJ0aWNsZV9saXN0KSB7XG4gICAgICAgIGlmIChhcnRpY2xlLmlkID09PSAraWQpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29kZTogXCIwMDAwMFwiLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBwdjogYXJ0aWNsZS5wYWdldmlld3MsXG4gICAgICAgICAgICAgIHB2RGF0YTogW1xuICAgICAgICAgICAgICAgIHsga2V5OiBcIlBDXCIsIHB2OiAxMDI0IH0sXG4gICAgICAgICAgICAgICAgeyBrZXk6IFwibW9iaWxlXCIsIHB2OiAxMDI0IH0sXG4gICAgICAgICAgICAgICAgeyBrZXk6IFwiaW9zXCIsIHB2OiAxMDI0IH0sXG4gICAgICAgICAgICAgICAgeyBrZXk6IFwiYW5kcm9pZFwiLCBwdjogMTAyNCB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1zZzogXCJcdTRFMDBcdTUyMDdva1wiLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICB9LFxuICB7XG4gICAgdXJsOiBcIi9hcGkvdjEvYXJ0aWNsZS91cGRhdGVcIixcbiAgICB0aW1lb3V0OiAyMDAsXG4gICAgbWV0aG9kOiBcInBvc3RcIixcbiAgICByZXNwb25zZTogKHsgYm9keSB9KSA9PiB7XG4gICAgICBjb25zdCB7IGlkLCAuLi51cGRhdGVkRmllbGRzIH0gPSBib2R5O1xuICAgICAgLy8gXHU2N0U1XHU2MjdFXHU4OTgxXHU2NkY0XHU2NUIwXHU3Njg0XHU2NTg3XHU3QUUwXG4gICAgICBjb25zdCBhcnRpY2xlVG9VcGRhdGUgPSBhcnRpY2xlX2xpc3QuZmluZChcbiAgICAgICAgKGFydGljbGU6IGFueSkgPT4gYXJ0aWNsZS5pZCA9PT0gaWRcbiAgICAgICk7XG5cbiAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NjI3RVx1NTIzMFx1NEU4Nlx1ODk4MVx1NjZGNFx1NjVCMFx1NzY4NFx1NjU4N1x1N0FFMFxuICAgICAgaWYgKGFydGljbGVUb1VwZGF0ZSkge1xuICAgICAgICAvLyBcdTRGN0ZcdTc1MjggT2JqZWN0LmFzc2lnbiBcdTY1QjlcdTZDRDVcdTY2RjRcdTY1QjBcdTY1ODdcdTdBRTBcbiAgICAgICAgT2JqZWN0LmFzc2lnbihhcnRpY2xlVG9VcGRhdGUsIHVwZGF0ZWRGaWVsZHMpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvZGU6IFwiMDAwMDBcIixcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBhcnRpY2xlOiBhcnRpY2xlVG9VcGRhdGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBtc2c6IFwiXHU0RTAwXHU1MjA3b2tcIixcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYEFydGljbGUgd2l0aCBpZCAke2lkfSBub3QgZm91bmQuYCk7XG4gICAgICB9XG4gICAgfSxcbiAgfSxcbiAge1xuICAgIHVybDogXCIvYXBpL3YxL2FydGljbGUvY3JlYXRlXCIsXG4gICAgdGltZW91dDogMjAwLFxuICAgIG1ldGhvZDogXCJwb3N0XCIsXG4gICAgcmVzcG9uc2U6ICh7IGJvZHkgfSkgPT4ge1xuICAgICAgY29uc3QgeyB0aXRsZSwgYXV0aG9yLCBpbXBvcnRhbmNlLCB0eXBlLCBzdGF0dXMsIHJlbWFyaywgdGltZXN0YW1wIH0gPVxuICAgICAgICBib2R5O1xuICAgICAgLy8gYXJ0aWNsZV9saXN0XHU2NzAwXHU1OTI3XHU3Njg0aWRcdTUwM0M7XG4gICAgICBjb25zdCBtYXhJZCA9IGFydGljbGVfbGlzdC5yZWR1Y2UoKG1heElkOiBudW1iZXIsIGFydGljbGU6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgobWF4SWQsIGFydGljbGUuaWQpO1xuICAgICAgfSwgLTEpO1xuICAgICAgY29uc3QgYXJ0aWNsZSA9IHtcbiAgICAgICAgaWQ6IG1heElkICsgMSxcbiAgICAgICAgdGltZXN0YW1wLFxuICAgICAgICBhdXRob3IsXG4gICAgICAgIHJldmlld2VyOiBgcmV2aWV3ZXIgJHttYXhJZCArIDF9YCxcbiAgICAgICAgdGl0bGUsXG4gICAgICAgIGltcG9ydGFuY2UsXG4gICAgICAgIHR5cGUsXG4gICAgICAgIHN0YXR1cyxcbiAgICAgICAgZGlzcGxheV90aW1lOiBuZXcgRGF0ZSh0aW1lc3RhbXApLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIHBhZ2V2aWV3czogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDUwMDAgLSAzMDApKSArIDMwMCxcbiAgICAgICAgcmVtYXJrLFxuICAgICAgfTtcbiAgICAgIGFydGljbGVfbGlzdC5wdXNoKGFydGljbGUpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogXCIwMDAwMFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgYXJ0aWNsZSxcbiAgICAgICAgfSxcbiAgICAgICAgbXNnOiBcIlx1NEUwMFx1NTIwN29rXCIsXG4gICAgICB9O1xuICAgIH0sXG4gIH0sXG4gIHtcbiAgICB1cmw6IFwiL2FwaS92MS9hcnRpY2xlL2RlbGV0ZVwiLFxuICAgIHRpbWVvdXQ6IDIwMCxcbiAgICBtZXRob2Q6IFwicG9zdFwiLFxuICAgIHJlc3BvbnNlOiAoeyBib2R5IH0pID0+IHtcbiAgICAgIGNvbnN0IHsgaWQgfSA9IGJvZHk7XG4gICAgICBjb25zdCBpbmRleCA9IGFydGljbGVfbGlzdC5maW5kSW5kZXgoKGFydGljbGU6IGFueSkgPT4gYXJ0aWNsZS5pZCA9PT0gaWQpO1xuICAgICAgYXJ0aWNsZV9saXN0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb2RlOiBcIjAwMDAwXCIsXG4gICAgICAgIG1zZzogXCJcdTRFMDBcdTUyMDdva1wiLFxuICAgICAgfTtcbiAgICB9LFxuICB9LFxuXSBhcyBNb2NrTWV0aG9kW107XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBRUEsSUFBTSxlQUFvQixDQUFDO0FBQzNCLElBQU0sUUFBUTtBQUVkLFNBQVMsSUFBSSxHQUFHLElBQUksT0FBTyxLQUFLO0FBQzlCLGVBQWEsS0FBSztJ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
