package c.eip.navigation.auth

import android.os.Build
import android.os.Bundle
import android.view.*
import android.widget.Button
import android.widget.ImageView
import androidx.annotation.RequiresApi
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.navOptions
import c.eip.R
import com.squareup.picasso.Picasso
import kotlinx.android.synthetic.main.auth_fragment.*

class AuthFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        setHasOptionsMenu(true)
        return inflater.inflate(R.layout.auth_fragment, container, false)
    }

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val picasso = Picasso.Builder(context!!).build()
        picasso.load("https://i.imgur.com/vhlRC2D.jpg").into(goToShop)
        picasso.load("https://i.imgur.com/XdLn9Mg.jpg").into(goToInf)
        val optionsInf = navOptions {
            anim {
                enter = R.anim.slide_in_right
                exit = R.anim.slide_out_left
                popEnter = R.anim.slide_in_left
                popExit = R.anim.slide_out_right
            }
        }
        val optionsShop = navOptions {
            anim {
                enter = R.anim.slide_in_left
                exit = R.anim.slide_out_right
                popEnter = R.anim.slide_in_right
                popExit = R.anim.slide_in_left
            }
        }
        view.findViewById<ImageView>(R.id.goToInf)?.setOnClickListener {
            findNavController().navigate(R.id.influenceur_auth, null, optionsInf)
        }
        view.findViewById<ImageView>(R.id.goToShop)?.setOnClickListener {
            findNavController().navigate(R.id.shop_auth, null, optionsShop)
        }
        view.findViewById<Button>(R.id.navigate_faq)?.setOnClickListener {
            findNavController().navigate(R.id.faq, null)
        }
        view.findViewById<Button>(R.id.navigate_contact)?.setOnClickListener {
            findNavController().navigate(R.id.contact, null)
        }
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        inflater.inflate(R.menu.main_menu, menu)
    }
}