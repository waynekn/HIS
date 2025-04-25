from dj_rest_auth.registration.views import RegisterView
from rest_framework_simplejwt.tokens import RefreshToken
from dj_rest_auth.registration.views import RegisterView
from rest_framework import status
from rest_framework.response import Response
from .serializers import UserDetailsSerializer


# Create your views here.


class AccountRegsitrationView(RegisterView):
    """
    Handle user registration and set authentication tokens as cookies.

    This view extends the `RegisterView` from `dj-rest-auth` to customize
    the response by setting the access and refresh tokens as HTTP-only cookies.
    By default, `dj-rest-auth` does not set these tokens as cookies during registration.
    """

    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save(request)
            user_response = UserDetailsSerializer(user).data
            response = Response(user_response,
                                status=status.HTTP_201_CREATED)

            refresh = RefreshToken.for_user(user)
            access = refresh.access_token

            response.set_cookie(
                key='access_token',
                value=str(access),
                httponly=True,
                samesite='Lax',
            )
            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                samesite='Lax',
            )

            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
