package c.eip.neoconnect.auth.shop

import android.content.Intent
import android.os.Bundle
import android.support.design.widget.TextInputEditText
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.widget.Toast
import c.eip.neoconnect.Constants
import c.eip.neoconnect.R
import c.eip.neoconnect.auth.influenceur.LoginInf
import c.eip.neoconnect.model.Boutique
import c.eip.neoconnect.model.LoginModel
import c.eip.neoconnect.services.AuthService
import kotlinx.android.synthetic.main.login_shop.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class LoginShop : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.login_shop)
        loginShop.setOnClickListener {
            loginShop()
        }
        switchRegisterShop.setOnClickListener {
            val intent = Intent(applicationContext, RegisterShop::class.java)
            startActivity(intent)
        }
        switchSideToInf.setOnClickListener {
            val intent = Intent(applicationContext, LoginInf::class.java)
            startActivity(intent)
        }
    }

    fun loginShop() {
        loginModel.pseudo = findViewById<TextInputEditText>(R.id.pseudo).text.toString()
        loginModel.password = findViewById<TextInputEditText>(R.id.password).text.toString()
        val retrofit =
            Retrofit.Builder().baseUrl(baseUrl).addConverterFactory(GsonConverterFactory.create()).build()
        val authService = retrofit.create(AuthService::class.java)
        val call = authService.loginShop(loginModel)
        call.enqueue(object : Callback<Boutique> {
            override fun onResponse(call: Call<Boutique>, response: Response<Boutique>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@LoginShop, "Connexion réussie", Toast.LENGTH_SHORT).show()
                    Log.i("Connexion boutique", "Utilisateur $pseudo connexion OK")
//                    val intent = Intent(applicationContext, LoginInf::class.java)
//                    startActivity(intent)
                }
            }

            override fun onFailure(call: Call<Boutique>?, t: Throwable) {
                Log.e("Connexion erreur:", t.message)
            }
        })
    }

    companion object {
        val loginModel = LoginModel()
        var baseUrl = Constants.BASE_URL
    }
}