package c.eip.navigation.auth.shop


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
import c.eip.model.Boutique
import c.eip.model.UserModel
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
        return inflater.inflate(R.layout.fragment_shop_register, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        view.findViewById<Button>(R.id.registerShop).setOnClickListener {
            val pseudo = view.findViewById<TextInputEditText>(R.id.pseudo).text.toString()
            val password = view.findViewById<TextInputEditText>(R.id.password).text.toString()
            val city = view.findViewById<TextInputEditText>(R.id.city).text.toString()
            val name = view.findViewById<TextInputEditText>(R.id.name).text.toString()
            val email = view.findViewById<TextInputEditText>(R.id.email).text.toString()
            val phone = view.findViewById<TextInputEditText>(R.id.phone).text.toString()
            val postal = view.findViewById<TextInputEditText>(R.id.postal).text.toString()
            val theme = view.findViewById<TextInputEditText>(R.id.theme).text.toString()
            val society = view.findViewById<TextInputEditText>(R.id.society).text.toString()
            val poste = view.findViewById<TextInputEditText>(R.id.fonction).text.toString()
            registerShop(
                pseudo,
                password,
                city,
                name,
                email,
                phone,
                postal,
                theme,
                society,
                poste
            )
        }
        view.findViewById<Button>(R.id.switchLoginShop)?.setOnClickListener {
            findNavController().navigate(R.id.shop_login, null)
        }
        view.findViewById<Button>(R.id.switchSideToInf)?.setOnClickListener {
            findNavController().navigate(R.id.influenceur_auth, null)
        }
    }

    private fun registerShop(
        pseudo: String,
        password: String,
        city: String,
        name: String,
        email: String,
        phone: String,
        postal: String,
        theme: String,
        society: String,
        poste: String
    ) {
        shop.pseudo = pseudo
        shop.password = password
        shop.city = city
        shop.full_name = name
        shop.email = email
        shop.phone = phone
        shop.postal = postal
        shop.sujet = theme
        shop.society = society
        shop.fonction = poste
        val authService = retrofit.create(AuthAPI.AuthService::class.java)
        val call = authService.registerShop(shop)
        call.enqueue(object : Callback<Boutique> {
            override fun onResponse(call: Call<Boutique>, response: Response<Boutique>) {
                if (response.isSuccessful) {
                    AuthAPI.DataGetter.INSTANCE.saveData(
                        context!!,
                        response.body()?.token!!)
                    findNavController().navigate(R.id.shop_login, null)
                    Log.i("Inscription boutique", "Utilisateur $pseudo inscription OK")
                }
            }

            override fun onFailure(call: Call<Boutique>?, t: Throwable) {
                Log.e("Inscription erreur:", t.message)
            }
        })
    }

    companion object {
        var shop = Boutique()
        var baseUrl = Constants.BASE_URL
        var retrofit: Retrofit =
            Retrofit.Builder().baseUrl(baseUrl).addConverterFactory(GsonConverterFactory.create())
                .build()
    }
}
