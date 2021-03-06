#if DEBUG
#define TRACE_INTERFACE_CALLS
#endif

using System;

using System.Collections;
using System.ComponentModel;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;

namespace Mihailik.InternetExplorer
{
	public class PluggableProtocolHandler : 
        NativeMethods.IInternetProtocol,
        NativeMethods.IInternetProtocolRoot
	{
		public PluggableProtocolHandler()
		{
		}

        internal readonly object sync=new object();
        PluggableProtocolRequest m_Request;
        PluggableProtocolResponse m_Response;
        bool m_Started;
               
        public PluggableProtocolRequest Request
        {
            get { lock( sync ) return m_Request; }
        }

        public PluggableProtocolResponse Response
        {
            get { lock( sync ) return m_Response; }
        }

        public bool Started
        {
            get { lock( sync ) return m_Started; }
        }

        public event EventHandler ProtocolStart;
        public event AbortEventHandler ProtocolAbort;

        protected virtual void OnProtocolStart(EventArgs e)
        {
            EventHandler temp = ProtocolStart;
            if (temp != null)
            {
                temp(this,e);
            }
        }

        protected virtual void OnProtocolAbort(AbortEventArgs e)
        {
            AbortEventHandler temp = ProtocolAbort;
            if (temp != null)
            {
                temp(this, e);
            }
        }

        void ErrorHandledOnStart(EventArgs e)
        {
            try
            {
                OnProtocolStart(e);
            }
            catch( Exception err )
            {
                if( Response.OutputStream!=null
                    && Response.OutputStream.CanWrite )
                {
                    if( Response.ContentType+""=="" )
                        Response.ContentType="text/html";
                    Response.WriteLine("");
                    Response.WriteLine("<hr>========");
                    Response.WriteLine("<pre>");
                    Response.WriteLine(err);
                    Response.WriteLine("</pre>");
                    Response.EndResponse();
                }
                else
                {
                    //throw err;
                }
            }
        }

        void Start(
            string szUrl,
            NativeMethods.IInternetProtocolSink pOIProtSink,
            NativeMethods.IInternetBindInfo pOIBindInfo,
            NativeMethods.PI_FLAGS grfPI,
            int dwReserved )
        {
            lock( sync )
            {
                m_Request=new PluggableProtocolRequest( this, szUrl, pOIBindInfo, grfPI );

                m_Response=new PluggableProtocolResponse( this, pOIProtSink );
         
                m_Started=true;
            }
            ErrorHandledOnStart(EventArgs.Empty);
        }

        

        void Terminate(int dwOptions)
        {
            Dispose();
        }
        
        void Seek(long dlibMove, int dwOrigin, out long plibNewPosition)
        {
            throw new NotImplementedException();
        }

        void LockRequest(int dwOptions)
        {
        }

        void UnlockRequest()
        {
        }

        void Abort(int hrReason, int dwOptions)
        {
            Exception abortReason=null;
            try 
            {
                Marshal.ThrowExceptionForHR(hrReason); 
            }
            catch( Exception getError )
            {
                abortReason=getError;
            }

            OnProtocolAbort( new AbortEventArgs(abortReason) );

            Response.NotifySinkAbort(abortReason);

            Dispose();
        }

        void Suspend()
        {
            // Documentation says, Not currently implemented
        }

        void Resume()
        {
            // Documentation says, Not currently implemented
        }

        int Read( IntPtr pv, int cb, out int pcbRead )
        {
            return Response.ProtocolRead( pv, cb, out pcbRead );
        }

        void Continue(ref NativeMethods.PROTOCOLDATA pProtocolData)
        {
        }

        public void Dispose()
        {
            Dispose(true);
        }

        protected void Dispose(bool isDisposing)
        {
            GC.SuppressFinalize(this);
            if( isDisposing )
            {
                lock( sync )
                {
                    if( m_Response!=null )
                    {
                        m_Response.Dispose();
                        m_Response=null;
                    }

                    if( m_Request!=null )
                    {
                        m_Request.Dispose();
                        m_Request=null;
                    }
                }
            }
        }

        ~PluggableProtocolHandler()
        {
            Dispose(false);
        }

        #region IInternetProtocol Members

        void NativeMethods.IInternetProtocol.Start(
            string szUrl,
            NativeMethods.IInternetProtocolSink pOIProtSink,
            NativeMethods.IInternetBindInfo pOIBindInfo,
            NativeMethods.PI_FLAGS grfPI,
            int dwReserved )
        {
#if TRACE_INTERFACE_CALLS
            Trace.WriteLine("");
            Trace.WriteLine("");
            TraceHelper.TraceMethod(this,szUrl,pOIProtSink,pOIBindInfo,grfPI,dwReserved);
            try
            {
#endif
            Start(szUrl,pOIProtSink,pOIBindInfo,grfPI,dwReserved);
#if TRACE_INTERFACE_CALLS
            }
            catch( Exception err )
            {
                TraceHelper.TraceException(this,err);
                throw err;
            }
#endif
        }

        void NativeMethods.IInternetProtocol.Resume()
        {
#if TRACE_INTERFACE_CALLS
            TraceHelper.TraceMethod(this);
            try
            {
#endif
            Resume();
#if TRACE_INTERFACE_CALLS
            }
            catch( Exception err )
            {
                TraceHelper.TraceException(this,err);
                throw err;
            }
#endif
        }

        void NativeMethods.IInternetProtocol.Terminate(int dwOptions)
        {
#if TRACE_INTERFACE_CALLS
            TraceHelper.TraceMethod(this,dwOptions);
            try
            {
#endif
            Terminate(dwOptions);
#if TRACE_INTERFACE_CALLS
            }
            catch( Exception err )
            {
                TraceHelper.TraceException(this,err);
                throw err;
            }
#endif
        }

        void NativeMethods.IInternetProtocol.Seek(long dlibMove, int dwOrigin, out long plibNewPosition)
        {
#if TRACE_INTERFACE_CALLS
            TraceHelper.TraceMethod(this,dlibMove,dwOrigin);
            try
            {
#endif
            Seek(dlibMove,dwOrigin,out plibNewPosition);
#if TRACE_INTERFACE_CALLS
            }
            catch( Exception err )
            {
                TraceHelper.TraceException(this,err);
                throw err;
            }
#endif
        }

        void NativeMethods.IInternetProtocol.LockRequest(int dwOptions)
        {
#if TRACE_INTERFACE_CALLS
            TraceHelper.TraceMethod(this,dwOptions);
            try
            {
#endif
            LockRequest(dwOptions);
#if TRACE_INTERFACE_CALLS
            }
            catch( Exception err )
            {
                TraceHelper.TraceException(this,err);
                throw err;
            }
#endif
        }

        void NativeMethods.IInternetProtocol.UnlockRequest()
        {
#if TRACE_INTERFACE_CALLS
            TraceHelper.TraceMethod(this);
            try
            {
#endif
            UnlockRequest();
#if TRACE_INTERFACE_CALLS
            }
            catch( Exception err )
            {
                TraceHelper.TraceException(this,err);
                throw err;
            }
#endif
        }

        void NativeMethods.IInternetProtocol.Abort(int hrReason, int dwOptions)
        {
#if TRACE_INTERFACE_CALLS
            TraceHelper.TraceMethod(this,hrReason,dwOptions);
            try
            {
#endif
            Abort(hrReason,dwOptions);
#if TRACE_INTERFACE_CALLS
            }
            catch( Exception err )
            {
                TraceHelper.TraceException(this,err);
                throw err;
            }
#endif
        }

        void NativeMethods.IInternetProtocol.Suspend()
        {
#if TRACE_INTERFACE_CALLS
            TraceHelper.TraceMethod(this);
            try
            {
#endif
            Suspend();
#if TRACE_INTERFACE_CALLS
            }
            catch( Exception err )
            {
                TraceHelper.TraceException(this,err);
                throw err;
            }
#endif
        }

        int NativeMethods.IInternetProtocol.Read( IntPtr pv, int cb, out int pcbRead )
        {
#if TRACE_INTERFACE_CALLS
            TraceHelper.TraceMethod(this,pv,cb);
            pcbRead=0;
            try
            {                
#endif
            int result=Read(pv,cb,out pcbRead);
#if TRACE_INTERFACE_CALLS
                string resultString;
                if( result==0 )
                    resultString="0/S_OK (still can read)";
                else if( result==1 )
                    resultString="1/S_FALSE (completed)";
                else
                    resultString=result+"";

                Trace.WriteLine("IInternetProtocol.Read: "+resultString+" (pcbRead="+pcbRead+")");
#endif
            return result;
#if TRACE_INTERFACE_CALLS
            }
            catch( Exception err )
            {
                TraceHelper.TraceException(this,err);
                pcbRead=0;
                return Marshal.GetHRForException(err);
            }
#endif
        }

        void NativeMethods.IInternetProtocol.Continue(ref NativeMethods.PROTOCOLDATA pProtocolData)
        {
#if TRACE_INTERFACE_CALLS
            TraceHelper.TraceMethod(this,pProtocolData);
            try
            {
#endif
            Continue(ref pProtocolData);
#if TRACE_INTERFACE_CALLS
            }
            catch( Exception err )
            {
                TraceHelper.TraceException(this,err);
                throw err;
            }
#endif
        }

        #endregion
    
        #region IInternetProtocolRoot Members

        void NativeMethods.IInternetProtocolRoot.Start(
            string szUrl,
            NativeMethods.IInternetProtocolSink pOIProtSink,
            NativeMethods.IInternetBindInfo pOIBindInfo,
            NativeMethods.PI_FLAGS grfPI,
            int dwReserved )
        {
#if TRACE_INTERFACE_CALLS
            TraceHelper.TraceMethod( this, szUrl, pOIProtSink, pOIBindInfo, grfPI, dwReserved );
            try
            {
#endif
            Start(szUrl,pOIProtSink,pOIBindInfo,grfPI,dwReserved);
#if TRACE_INTERFACE_CALLS
            }
            catch( Exception err )
            {
                TraceHelper.TraceException(this,err);
                throw err;
            }
#endif
        }

        void NativeMethods.IInternetProtocolRoot.Resume()
        {
#if TRACE_INTERFACE_CALLS
            TraceHelper.TraceMethod( this );
            try
            {
#endif
            Resume();
#if TRACE_INTERFACE_CALLS
            }
            catch( Exception err )
            {
                TraceHelper.TraceException(this,err);
                throw err;
            }
#endif
        }

        void NativeMethods.IInternetProtocolRoot.Terminate(int dwOptions)
        {
#if TRACE_INTERFACE_CALLS
            TraceHelper.TraceMethod( this, dwOptions );
            try
            {
#endif
            Terminate(dwOptions);
#if TRACE_INTERFACE_CALLS
            }
            catch( Exception err )
            {
                TraceHelper.TraceException(this,err);
                throw err;
            }
#endif
        }

        void NativeMethods.IInternetProtocolRoot.Abort(int hrReason, int dwOptions)
        {
#if TRACE_INTERFACE_CALLS

            TraceHelper.TraceMethod( this, hrReason, dwOptions );
            try
            {
#endif
            Abort(hrReason,dwOptions);
#if TRACE_INTERFACE_CALLS
            }
            catch( Exception err )
            {
                TraceHelper.TraceException(this,err);
            }
#endif
        }

        void NativeMethods.IInternetProtocolRoot.Suspend()
        {
#if TRACE_INTERFACE_CALLS
            TraceHelper.TraceMethod( this );
            try
            {
#endif
            Suspend();
#if TRACE_INTERFACE_CALLS
            }
            catch( Exception err )
            {
                TraceHelper.TraceException(this,err);
                throw err;
            }
#endif
        }

        void NativeMethods.IInternetProtocolRoot.Continue(ref NativeMethods.PROTOCOLDATA pProtocolData)
        {
#if TRACE_INTERFACE_CALLS
            TraceHelper.TraceMethod( this, pProtocolData );
            try
            {
#endif
            Continue(ref pProtocolData);
#if TRACE_INTERFACE_CALLS
            }
            catch( Exception err )
            {
                TraceHelper.TraceException(this,err);
                throw err;
            }
#endif
        }

        #endregion

	}
}
