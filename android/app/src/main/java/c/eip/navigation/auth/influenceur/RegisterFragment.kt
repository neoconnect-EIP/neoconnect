package c.eip.navigation.auth.influenceur


import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import c.eip.Constants
import c.eip.R
import c.eip.model.Influenceur
import c.eip.services.AuthAPI
import com.google.android.material.textfield.TextInputEditText
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class RegisterFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_influenceur_register, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        view.findViewById<Button>(R.id.registerInf).setOnClickListener {
            val pseudo = view.findViewById<TextInputEditText>(R.id.pseudo).text.toString()
            val password = view.findViewById<TextInputEditText>(R.id.password).text.toString()
            val city = view.findViewById<TextInputEditText>(R.id.city).text.toString()
            val name = view.findViewById<TextInputEditText>(R.id.name).text.toString()
            val email = view.findViewById<TextInputEditText>(R.id.email).text.toString()
            val phone = view.findViewById<TextInputEditText>(R.id.phone).text.toString()
            val postal = view.findViewById<TextInputEditText>(R.id.postal).text.toString()
            val theme = view.findViewById<TextInputEditText>(R.id.theme).text.toString()
            val facebook = view.findViewById<TextInputEditText>(R.id.facebook).text.toString()
            val twitter = view.findViewById<TextInputEditText>(R.id.twitter).text.toString()
            val snapchat = view.findViewById<TextInputEditText>(R.id.snapchat).text.toString()
            val instagram = view.findViewById<TextInputEditText>(R.id.instagram).text.toString()
            registerInf(
                pseudo,
                password,
                city,
                name,
                email,
                phone,
                postal,
                theme,
                facebook,
                twitter,
                snapchat,
                instagram
            )
        }
        view.findViewById<Button>(R.id.switchLoginInf)?.setOnClickListener {
            findNavController().navigate(R.id.influenceur_login, null)
        }
        view.findViewById<Button>(R.id.switchSideToShop)?.setOnClickListener {
            findNavController().navigate(R.id.shop_auth, null)
        }
    }

    private fun registerInf(
        pseudo: String,
        password: String,
        city: String,
        name: String,
        email: String,
        phone: String,
        postal: String,
        theme: String,
        facebook: String,
        twitter: String,
        snapchat: String,
        instagram: String
    ) {
        inf.pseudo = pseudo
        inf.password = password
        inf.city = city
        inf.full_name = name
        inf.email = email
        inf.phone = phone
        inf.postal = postal
        inf.sujet = theme
        inf.facebook = facebook
        inf.twitter = twitter
        inf.snapchat = snapchat
        inf.instagram = instagram
        val authService = retrofit.create(AuthAPI.AuthService::class.java)
        val call = authService.registerInfluencer(inf)
        call.enqueue(object : Callback<Influenceur> {
            override fun onResponse(call: Call<Influenceur>, response: Response<Influenceur>) {
                if (response.isSuccessful) {
                    AuthAPI.DataGetter.INSTANCE.saveData(
                        context!!,
                        response.body()?.token!!
                    )
                    findNavController().navigate(R.id.influenceur_login, null)
                    Log.i("Inscription influenceur", "Utilisateur $pseudo inscription OK")
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
        var retrofit: Retrofit =
            Retrofit.Builder().baseUrl(baseUrl).addConverterFactory(GsonConverterFactory.create())
                .build()
    }
}
