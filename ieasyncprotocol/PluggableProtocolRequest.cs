using System;

using System.Text;
using System.IO;
using System.Runtime.InteropServices;
using System.Runtime.InteropServices.ComTypes;

namespace Mihailik.InternetExplorer
{
	public class PluggableProtocolRequest
	{
		internal PluggableProtocolRequest(
            PluggableProtocolHandler handler,
            string url,
            NativeMethods.IInternetBindInfo bind,
            NativeMethods.PI_FLAGS startFlags )
		{
            m_Url=new Uri(url);

            NativeMethods.BINDF bindf;
            NativeMethods.BINDINFO bindinfo = new NativeMethods.BINDINFO();

            bindinfo.cbSize = Marshal.SizeOf( typeof(NativeMethods.STGMEDIUM) );
            bindinfo.cbSize = Marshal.SizeOf( typeof(NativeMethods.BINDINFO) );

//            string userAgent=GetBindString(
//                bind,
//                NativeMethods.BINDSTRING.BINDSTRING_USERAGENT );
//
//            System.Diagnostics.Trace.WriteLine(
//                "useragent: "+GetBindString(bind,NativeMethods.BINDSTRING.BINDSTRING_USERAGENT)+"\r\n"+
//                "url: "+GetBindString(bind,NativeMethods.BINDSTRING.BINDSTRING_URL)+"\r\n"+
//                "post cookie: "+GetBindString(bind,NativeMethods.BINDSTRING.BINDSTRING_POST_COOKIE)+"\r\n"+
//                "post MIME: "+GetBindString(bind,NativeMethods.BINDSTRING.BINDSTRING_POST_DATA_MIME) );



            bind.GetBindInfo( out bindf, ref bindinfo );

            switch( bindinfo.dwBindVerb )
            {
                case NativeMethods.BINDVERB.BINDVERB_GET: // GET
                    
                    m_Verb="GET";
                    m_VerbData=null;
                    break;

                case NativeMethods.BINDVERB.BINDVERB_POST:
                    
                    m_Verb="POST";
                    m_VerbData=ExtractVerbData(bindinfo);
                    
                    break;

                case NativeMethods.BINDVERB.BINDVERB_PUT:
                    
                    m_Verb="PUT";
                    m_VerbData=ExtractVerbData(bindinfo);

                    break;

                case NativeMethods.BINDVERB.BINDVERB_CUSTOM:
                    
                    m_Verb=Marshal.PtrToStringUni( bindinfo.szCustomVerb );
                    m_VerbData=ExtractVerbData(bindinfo);

                    break;
            }
        }

        #region GetBindString extractors
        static string GetBindString(NativeMethods.IInternetBindInfo bind, NativeMethods.BINDSTRING kind)
        {
            string[] result=GetBindStringList(bind,kind,1);
            if( result.Length==0 )
                return null;
            else
                return result[0];
        }

        static string[] GetBindStringList(NativeMethods.IInternetBindInfo bind, NativeMethods.BINDSTRING kind)
        {
            return GetBindStringList(bind,kind,500);
        }

        static string[] GetBindStringList(NativeMethods.IInternetBindInfo bind, NativeMethods.BINDSTRING kind, int count)
        {
            IntPtr pArray=Marshal.AllocCoTaskMem( Marshal.SizeOf(typeof(IntPtr))*count );
            try
            {
                int resultCount=count;

                bind.GetBindString(
                    NativeMethods.BINDSTRING.BINDSTRING_USERAGENT,
                    pArray,
                    count,
                    ref resultCount );

                string[] result=new string[resultCount];
                for( int i=0; i<resultCount; i++ )
                {
                    result[i]=Marshal.PtrToStringUni(
                        Marshal.ReadIntPtr( new IntPtr(pArray.ToInt64()+i) ) );
                }

                return result;
            }
            finally
            {
                Marshal.FreeCoTaskMem( pArray );
            }
        }
        #endregion

        readonly System.Uri m_Url;
        readonly string m_Verb;
        readonly byte[] m_VerbData;

        public System.Uri Url
        {
            get { return m_Url; }
        }

        public string Verb
        {
            get { return m_Verb; }
        }

        public byte[] VerbData
        {
            get { return m_VerbData; }
        }

        public void Dispose()
        {
            Dispose(true);
        }

        protected void Dispose(bool isDisposing)
        {
            if( isDisposing )
            {
                GC.SuppressFinalize(this);
                //try { Marshal.ReleaseComObject(sink); }
            }
        }

        ~PluggableProtocolRequest()
        {
            Dispose(false);
        }

        byte[] ExtractVerbData(NativeMethods.BINDINFO bindinfo)
        {
            if( bindinfo.cbstgmedData==0 )//|| bindinfo.stgmedData==IntPtr.Zero )
                return null;

            NativeMethods.STGMEDIUM med=bindinfo.stgmedData;// (NativeMethods.STGMEDIUM)( Marshal.PtrToStructure(bindinfo.stgmedData,typeof(NativeMethods.STGMEDIUM)) );

            if( (med.tymed & NativeMethods.TYMED.TYMED_HGLOBAL)==0 )
                return null;

            IStream pStream = null;

            int hresult=NativeMethods.CreateStreamOnHGlobal(
                med.hGlobal,
                0, out pStream );

            Marshal.ThrowExceptionForHR(hresult);

            try
            {
                if( pStream==null )
                    return null;

                byte[] result=new byte[(int)bindinfo.cbstgmedData];

                pStream.Read( result, result.Length, IntPtr.Zero );

                return result;
            }
            finally
            {
                Marshal.ReleaseComObject( pStream );
            }
        }

	}
}
