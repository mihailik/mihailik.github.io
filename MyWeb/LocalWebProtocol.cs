using System;

using System.Collections;
using System.Reflection;
using System.IO;
using System.Runtime.InteropServices;
using System.Web;
using System.Web.Hosting;

using Microsoft.Win32;

using Mihailik.InternetExplorer;

namespace Mihailik.InternetExplorer.Protocols
{
    [Guid("33c4e6d5-739e-40d3-8073-85d00ea1c45d")]
	public class LocalWebProtocol : PluggableProtocolHandler
	{
        public static readonly string Schema="myweb";

        #region Registrations
        
        static readonly object registerSync=new object();
        static bool registered=false;
        static bool permanent=false;


        public static void RegisterTemporary()
        {
            lock( registerSync )
            {
                if( registered )
                    throw new InvalidOperationException("Protocol already registered.");

                PluggableProtocolRegistrationServices.RegisterTemporaryProtocolHandler(
                    MethodBase.GetCurrentMethod().DeclaringType,
                    Schema );

                registered=true;
                permanent=false;
            }
        }

        public static void RegisterPermanent()
        {
            lock( registerSync )
            {
                if( registered )
                    throw new InvalidOperationException("Protocol already registered.");

                PluggableProtocolRegistrationServices.RegisterPermanentProtocolHandler(
                    MethodBase.GetCurrentMethod().DeclaringType,
                    Schema );

                registered=true;
                permanent=false;
            }
        }

        public static void Unregister()
        {
            lock( registerSync )
            {
                if( !registered )
                    throw new InvalidOperationException("Protocol not yet registered.");

                if( permanent )
                    PluggableProtocolRegistrationServices.UnregisterPermanentProtocolHandler(
                        MethodBase.GetCurrentMethod().DeclaringType,
                        Schema );
                else
                    PluggableProtocolRegistrationServices.UnregisterTemporaryProtocolHandler(
                        MethodBase.GetCurrentMethod().DeclaringType,
                        Schema );

                registered=false;
            }
        }

        #endregion

        #region COM Registration

        [ComRegisterFunction]
        static void ComRegister(Type protocolClass)
        {
            if( protocolClass==null )
                throw new ArgumentNullException("protocolClass");
            else if( protocolClass!=MethodBase.GetCurrentMethod().DeclaringType )
                throw new ArgumentException("protocolClass");
            else
                RegisterPermanent();
        }

        [ComUnregisterFunction]
        static void ComUnregister(Type protocolClass)
        {
            if( protocolClass==null )
                throw new ArgumentNullException("protocolClass");
            else if( protocolClass!=MethodBase.GetCurrentMethod().DeclaringType )
                throw new ArgumentException("protocolClass");
            else
                Unregister();
        }

        #endregion

		public LocalWebProtocol()
		{
		}

        


        protected override void OnProtocolStart(EventArgs e)
        {
            new System.Threading.ThreadStart( Process ).BeginInvoke(null,null);
        }

        void Process()
        {
            try
            {
                string appRootPath = Path.GetPathRoot(Request.Url.LocalPath).ToLower();

                LocalWebHost host = WebApplicationPool.GetHost(Request.Url);

                ResponseInfo response = host.ProcessRequest(
                    new RequestInfo(Request.Url + "", Request.Verb, Request.VerbData));

                Response.ContentType = response.MimeType;
                if (response.ResponseBytes != null
                    && response.ResponseBytes.Length > 0)
                {
                    Response.OutputStream.Write(
                        response.ResponseBytes,
                        0,
                        response.ResponseBytes.Length);
                }

                Response.EndResponse();
            }
            catch (Exception error)
            {
                throw;
            }
        }
	}
}