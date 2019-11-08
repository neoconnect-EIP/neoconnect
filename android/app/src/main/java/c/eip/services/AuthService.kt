package c.eip.services

import android.content.Context
import c.eip.model.Boutique
import c.eip.model.Influenceur
import c.eip.model.LoginModel
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

object AuthAPI {
    interface AuthService {
        @POST("/inf/register")
        fun registerInfluencer(
            @Body influenceur: Influenceur
        ): Call<Influenceur>

        @POST("/inf/login")
        fun loginInfluencer(
            @Body loginModel: LoginModel
        ): Call<Influenceur>

        @POST("/shop/register")
        fun registerShop(@Body shop: Boutique): Call<Boutique>

        @POST("/shop/login")
        fun loginShop(
            @Body loginModel: LoginModel
        ): Call<Boutique>
    }

    class DataGetter {
        fun saveToken(context: Context, token: String?) {
            context.getSharedPreferences("user", 0).edit().putString("token", token!!).apply()
        }

        fun getToken(context: Context): String? {
            return context.getSharedPreferences("user", 0).getString("token", "")
        }

        fun getUserId(context: Context): Int? {
            return context.getSharedPreferences("user", 0).getInt("idUser", 0)
        }

        companion object {
            val INSTANCE: DataGetter = DataGetter()
        }
    }
}