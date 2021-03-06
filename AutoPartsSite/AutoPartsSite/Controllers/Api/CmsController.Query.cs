﻿using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Sql;
using AutoPartsSite.Models.Cms;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using AutoPartsSite.Core.Controllers;

namespace AutoPartsSite.Controllers.Api
{
    public partial class CmsController
    {
        [NonAction]
        protected override Query CreateQuery()
        {
            return AppSettings.Query.Cms;
        }


        [NonAction]
        private PageEdit GetPageEdit(string page)
        {
            PageEdit result = null;
            ExecQuery((query) =>
            {
                query.Execute(@"Page\[get]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Page", Value = page }
                }
                , onExecute: null
                , (values) =>
                {
                    result = new PageEdit()
                    {
                        Id = (int)values[0],
                        Page = (string)values[1],
                        ContentEn = string.Empty,
                        ContentRu = string.Empty
                    };
                });
            });
            return result;
        }

        [NonAction]
        internal static T GetEditContent<T, C>(QueryController<C> controller, string command, T page) where T : PageEdit
        {
            T result = page;
            result.ContentEn = string.Empty;
            result.ContentRu = string.Empty;

            controller.ExecQuery((query) =>
            {
                query.Execute(command, new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Id", Value = page.Id }
                }
                , onExecute: null
                , (values) =>
                {
                    string content = values[2] == DBNull.Value ? string.Empty : (string)values[2];
                    if (!string.IsNullOrEmpty(content))
                        result.ContentEn = string.Concat(result.ContentEn, content);

                    content = values[3] == DBNull.Value ? string.Empty : (string)values[3];
                    if (!string.IsNullOrEmpty(content))
                        result.ContentRu = string.Concat(result.ContentRu, content);
                });
            });
            return result;
        }

        [NonAction]
        private List<(int, string, string)> GetChangeListContent(Query query, int Id, string getCommand)
        {
            List<(int, string, string)> list = new List<(int, string, string)>();
            query.Execute(getCommand, new SqlParameter[]
            {
                    new SqlParameter() { ParameterName = "@Id", Value = Id }
            }
            , onExecute: null
            , (values) =>
            {
                list.Add((-(int)values[1], (values[2] == DBNull.Value ? string.Empty : (string)values[2]), (values[3] == DBNull.Value ? string.Empty : (string)values[3])));
            });
            return list;
        }

        [NonAction]
        private void BuildChangeListContent(string ContentEn, string ContentRu, List<(int, string, string)> List)
        {
            List<(int, string, string)> list = List;
            string contentEn = ContentEn, contentRu = ContentRu;
            int index = 0, lenContentMax = 4000
              , lenEn = string.IsNullOrEmpty(contentEn) ? 0 : contentEn.Length
              , lenRu = string.IsNullOrEmpty(contentRu) ? 0 : contentRu.Length;

            while (lenEn > 0 || lenRu > 0)
            {
                if (index < list.Count)
                    list[index] = (index + 1, lenEn > lenContentMax ? contentEn.Substring(0, lenContentMax) : contentEn, lenRu > lenContentMax ? contentRu.Substring(0, lenContentMax) : contentRu);
                else
                    list.Add((index + 1, lenEn > lenContentMax ? contentEn.Substring(0, lenContentMax) : contentEn, lenRu > lenContentMax ? contentRu.Substring(0, lenContentMax) : contentRu));
                contentEn = lenEn > lenContentMax ? contentEn.Substring(lenContentMax) : string.Empty;
                contentRu = lenRu > lenContentMax ? contentRu.Substring(lenContentMax) : string.Empty;
                lenEn = string.IsNullOrEmpty(contentEn) ? 0 : contentEn.Length;
                lenRu = string.IsNullOrEmpty(contentRu) ? 0 : contentRu.Length;
                index++;
            }
        }

        [NonAction]
        private void SaveChangeListContent(Query query, int Id, List<(int, string, string)> List, string setCommand, string delCommand)
        {
            List<(int, string, string)> list = List;
            foreach (var item in list)
            {
                if (item.Item1 > 0)
                {
                    query.ExecuteNonQuery(setCommand, new SqlParameter[]
                    {
                            new SqlParameter() { ParameterName = "@Id", Value = Id },
                            new SqlParameter() { ParameterName = "@Index", Value = item.Item1 },
                            new SqlParameter() { ParameterName = "@ContentEn", Value = item.Item2 },
                            new SqlParameter() { ParameterName = "@ContentRu", Value = item.Item3 }
                    });
                }
                else
                {
                    query.ExecuteNonQuery(delCommand, new SqlParameter[]
                    {
                            new SqlParameter() { ParameterName = "@Id", Value = Id },
                            new SqlParameter() { ParameterName = "@Index", Value = item.Item1 }
                    });
                }
            }
        }

        [NonAction]
        private void SetEditContent<T>(string changeCmd, string setCmd, string delCmd, T page) where T : PageEdit
        {
            ExecQuery((query) =>
            {
                List<(int, string, string)> list = GetChangeListContent(query, page.Id, changeCmd);
                BuildChangeListContent(page.ContentEn, page.ContentRu, list);
                SaveChangeListContent(query, page.Id, list, setCmd, delCmd);
            });
        }

        [NonAction]
        private NewEdit SetNewEdit(NewEdit page)
        {
            NewEdit result = page;
            ExecQuery((query) =>
            {
                query.Execute(@"New\[set]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Id", Value = page.Id },
                    new SqlParameter() { ParameterName = "@ReleaseDate", Value = page.ReleaseDate },
                    new SqlParameter() { ParameterName = "@HeaderEn", Value = page.HeaderEn },
                    new SqlParameter() { ParameterName = "@HeaderRu", Value = page.HeaderRu }
                }
                , onExecute: null
                , (values) =>
                {
                    result.Id = (int)values[0];
                });
            });
            return result ?? new NewEdit();
        }

        [NonAction]
        internal static NewEdit GetNewEdit<C>(QueryController<C> controller, int id)
        {
            NewEdit result = null;
            controller.ExecQuery((query) =>
            {
                query.Execute(@"New\[get]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Id", Value = id }
                }
                , onExecute: null
                , (values) =>
                {
                    result = new NewEdit()
                    {
                        Id = (int)values[0],
                        ReleaseDate = (DateTime)values[1],
                        HeaderEn = (string)values[2],
                        HeaderRu = (string)values[3]
                    };
                });
            });
            return result?? new NewEdit();
        }

        [NonAction]
        internal static List<NewEdit> GetNews<C>(QueryController<C> controller, int pageRows, int page)
        {
            List<NewEdit> result = new List<NewEdit>();
            controller.ExecQuery((query) =>
            {
                query.Execute(@"New\[get_paged]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@RowspPage", Value = pageRows },
                    new SqlParameter() { ParameterName = "@PageNumber", Value = page }
                }
                , onExecute: null
                , (values) =>
                {
                    result.Add(new NewEdit()
                    {
                        Id = (int)values[0],
                        ReleaseDate = (DateTime)values[1],
                        HeaderEn = (string)values[2],
                        HeaderRu = (string)values[3]
                    });
                });
            });
            return result;
        }

        [NonAction]
        private List<NewEdit> GetCardNews()
        {
            List<NewEdit> result = new List<NewEdit>();
            ExecQuery((query) =>
            {
                query.Execute(@"New\[get]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Id", Value = 0 }
                }
                , onExecute: null
                , (values) =>
                {
                    result.Add(new NewEdit()
                    {
                        Id = (int)values[0],
                        ReleaseDate = (DateTime)values[1],
                        HeaderEn = (string)values[2],
                        HeaderRu = (string)values[3]
                    });
                });
            });
            return result;
        }

        [NonAction]
        private void DeleteNew(int Id)
        { 
            ExecQuery((query) =>
            {
                query.ExecuteNonQuery(@"New\[del]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Id", Value = Id }
                });
            });
        }
    }
}
