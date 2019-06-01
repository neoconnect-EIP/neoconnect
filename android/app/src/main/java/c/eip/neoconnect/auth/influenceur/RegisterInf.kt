package c.eip.neoconnect.auth.influenceur

import android.content.Intent
import android.os.Bundle
import android.support.design.widget.TextInputEditText
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.widget.Toast
import c.eip.neoconnect.Constants
import c.eip.neoconnect.R
import c.eip.neoconnect.model.Influenceur
import c.eip.neoconnect.services.AuthService
import kotlinx.android.synthetic.main.register_inf.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class RegisterInf : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.register_inf)
        registerInf.setOnClickListener {
            registerInf()
        }
        retour.setOnClickListener {
            val intent = Intent(applicationContext, LoginInf::class.java)
            startActivity(intent)
        }
    }

    fun registerInf() {
        inf.pseudo = findViewById<TextInputEditText>(R.id.pseudo).text.toString()
        inf.password = findViewById<TextInputEditText>(R.id.password).text.toString()
        inf.city = findViewById<TextInputEditText>(R.id.city).text.toString()
        inf.full_name = findViewById<TextInputEditText>(R.id.name).text.toString()
        inf.email = findViewById<TextInputEditText>(R.id.email).text.toString()
        inf.phone = findViewById<TextInputEditText>(R.id.phone).text.toString()
        inf.postal = findViewById<TextInputEditText>(R.id.postal).text.toString()
        inf.sujet = findViewById<TextInputEditText>(R.id.theme).text.toString()
        inf.facebook = findViewById<TextInputEditText>(R.id.facebook).text.toString()
        inf.twitter = findViewById<TextInputEditText>(R.id.twitter).text.toString()
        inf.snapchat = findViewById<TextInputEditText>(R.id.snapchat).text.toString()
        inf.instagram = findViewById<TextInputEditText>(R.id.instagram).text.toString()
        val retrofit = Retrofit.Builder().baseUrl(baseUrl).addConverterFactory(GsonConverterFactory.create()).build()
        val authService = retrofit.create(AuthService::class.java)
        val call = authService.registerInfluencer(inf)
        call.enqueue(object : Callback<Influenceur> {
            override fun onResponse(call: Call<Influenceur>, response: Response<Influenceur>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@RegisterInf, "Inscription réussie", Toast.LENGTH_LONG).show()
                    Log.i("Influenceur inscription", "User " + inf.pseudo + " inscription OK")
                    val intent = Intent(applicationContext, LoginInf::class.java)
                    startActivity(intent)
                }
            }

            override fun onFailure(call: Call<Influenceur>?, t: Throwable) {
                Log.e("Inscription erreur:", t.message)
            }
        })
    }


    companion object {
        var inf = Influenceur()
        var baseUrl = Constants.BASE_URL
    }
}
