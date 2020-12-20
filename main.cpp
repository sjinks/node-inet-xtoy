#include <napi.h>
#include <uv.h>
#include <arpa/inet.h>
#include <string>
#include <cerrno>

[[noreturn]] static void throwErrnoError(Napi::Env env, int code)
{
	napi_value error;
	napi_create_error(env, Napi::Value::From(env, uv_err_name(-code)), Napi::Value::From(env, uv_strerror(-code)), &error);

	Napi::Error err(env, error);
	err.Set("errno", Napi::Value::From(env, code));
	throw err;
}

static Napi::Value InetPtoN(const Napi::CallbackInfo& info)
{
	const Napi::Env& env = info.Env();
	unsigned char buf[sizeof(struct in6_addr)];
	if (info.Length() != 1) {
		throw Napi::TypeError::New(env, "Wrong number of arguments");
	}

	if (!info[0].IsString()) {
		throw Napi::TypeError::New(env, "The argument is expected to be a string");
	}

	const Napi::String arg = info[0].As<Napi::String>();
	const std::string ip = arg;
	bool is_v6 = ip.find(':') != std::string::npos;

	int res = inet_pton(is_v6 ? AF_INET6 : AF_INET, ip.c_str(), buf);
	switch (res) {
		case -1:
			throwErrnoError(env, errno);

		case 0:
			return env.Null();

		default:
			return Napi::Buffer<unsigned char>::Copy(env, buf, is_v6 ? sizeof(struct in6_addr) : sizeof(struct in_addr));
	}
}

static Napi::Value InetNtoP(const Napi::CallbackInfo& info)
{
	const Napi::Env& env = info.Env();
	if (info.Length() != 1) {
		throw Napi::TypeError::New(env, "Wrong number of arguments");
	}

	std::string binary;
	const char* buffer = nullptr;
	size_t size = 0;
	if (info[0].IsBuffer()) {
		Napi::Buffer<char> buf = info[0].As<Napi::Buffer<char> >();
		buffer = buf.Data();
		size = buf.ByteLength();
	}
	else if (info[0].IsString()) {
		binary = info[0].As<Napi::String>();
		buffer = binary.c_str();
		size = binary.size();
	}
	else {
		throw Napi::TypeError::New(env, "The argument is expected to be a string or a Buffer");
	}

	char str[INET6_ADDRSTRLEN];
	int family;
	if (size == 4) {
		family = AF_INET;
	}
	else if (size == 16) {
		family = AF_INET6;
	}
	else {
		throw Napi::TypeError::New(env, "The argument is of the wrong size");
	}

	if (!inet_ntop(family, buffer, str, INET6_ADDRSTRLEN)) {
		throwErrnoError(env, errno);
	}

	return Napi::Value::From(env, str);
}

static Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set("inet_ntop", Napi::Function::New(env, InetNtoP));
    exports.Set("inet_pton", Napi::Function::New(env, InetPtoN));
    return exports;
}

NODE_API_MODULE(inet_xtoy, Init)
