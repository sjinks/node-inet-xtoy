#include <nan.h>
#include <arpa/inet.h>
#include <string>
#include <cerrno>

static NAN_METHOD(inet_pton)
{
	if (info.Length() != 1) {
		return Nan::ThrowTypeError("Wrong number of arguments");
	}

	if (!info[0]->IsString()) {
		return Nan::ThrowTypeError("Wrong argument");
	}

	char buf[sizeof(struct in6_addr)];
	std::string s_ip = std::string(*Nan::Utf8String(info[0].As<v8::String>()));
	bool is_v6 = s_ip.find(':') != std::string::npos;

	int res = inet_pton(is_v6 ? AF_INET6 : AF_INET, s_ip.c_str(), buf);
	if (-1 == res) {
		return Nan::ThrowError(node::ErrnoException(v8::Isolate::GetCurrent(), errno, std::strerror(errno)));
	}

	if (0 == res) {
		info.GetReturnValue().Set(Nan::Null());
		return;
	}

	Nan::MaybeLocal<v8::Object> result = Nan::CopyBuffer(buf, is_v6 ? sizeof(struct in6_addr) : sizeof(struct in_addr));
	info.GetReturnValue().Set(result.ToLocalChecked());
}

static NAN_METHOD(inet_ntop)
{
	if (info.Length() != 1) {
		return Nan::ThrowTypeError("Wrong number of arguments");
	}

	const char* buffer = nullptr;
	size_t size = 0;
	std::string s;

	if (info[0]->IsArrayBufferView()) {
		buffer = node::Buffer::Data(info[0]);
		size   = node::Buffer::Length(info[0]);
	}
	else if (info[0]->IsString()) {
		Nan::Utf8String v(info[0]);
		s = *v;
		buffer = s.c_str();
		size   = s.size();
	}
	else {
		return Nan::ThrowTypeError("Wrong argument");
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
		Nan::ThrowTypeError("Wrong argument");
		return;
	}

	if (!inet_ntop(family, buffer, str, INET6_ADDRSTRLEN)) {
		return Nan::ThrowError(node::ErrnoException(v8::Isolate::GetCurrent(), errno, std::strerror(errno)));
	}

	info.GetReturnValue().Set(Nan::New(str).ToLocalChecked());
}

static NAN_MODULE_INIT(InitAll)
{
	Nan::Set(target, Nan::New("inet_pton").ToLocalChecked(), Nan::GetFunction(Nan::New<v8::FunctionTemplate>(inet_pton)).ToLocalChecked());
	Nan::Set(target, Nan::New("inet_ntop").ToLocalChecked(), Nan::GetFunction(Nan::New<v8::FunctionTemplate>(inet_ntop)).ToLocalChecked());
}

NODE_MODULE(inet_xtoy, InitAll)
