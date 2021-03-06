﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using IPrincipal = System.Security.Principal.IPrincipal;

namespace Mihailik.Net
{
    public sealed class HttpListenerContext
    {
        readonly HttpListenerRequest m_Request;
        readonly HttpListenerResponse m_Response;
        readonly IPrincipal m_User;

        public HttpListenerRequest Request { get { return m_Request; } }
        public HttpListenerResponse Response { get { return m_Response; } }
        public IPrincipal User { get { return m_User; } }

        internal bool SendChunked;
        internal long ResponseContentLength64;
        internal int WrittenContentLength;
        internal MemoryStream ChunkHeaderBufStream;
        internal StreamWriter ChunkHeaderBufWriter;

        public HttpListenerContext(
            HttpListenerRequest request,
            HttpListenerResponse response,
            IPrincipal user)
        {
            this.m_Request = request;
            this.m_Response = response;
            this.m_User = user;
        }
    }
}
